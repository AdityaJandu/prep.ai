
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

import {
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallSessionParticipantLeftEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent,
    MessageNewEvent
} from "@stream-io/node-sdk";

import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { inngest } from "@/inngest/client";

import { generateAvatar } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";

const openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

function verifySignatureWithSDK(body: string, signature: string): boolean {
    return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature");
    const apiKey = req.headers.get("x-api-key");

    if (!signature || !apiKey) {
        return NextResponse.json(
            { error: "Missing signature or API key" },
            { status: 404 },
        );
    }

    const body = await req.text();

    if (!verifySignatureWithSDK(body, signature)) {
        return NextResponse.json(
            { error: "Invalid signature" },
            { status: 401 },
        );
    }

    let payLoad: unknown;

    try {
        payLoad = JSON.parse(body) as Record<string, unknown>;
    } catch (error) {
        return NextResponse.json(
            { error: error },
            { status: 400 },
        );
    }

    const eventType = (payLoad as Record<string, unknown>)?.type;

    if (eventType === "call.session_started") {
        const event = payLoad as CallSessionStartedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json(
                { error: "Missing meeting id" },
                { status: 400 },
            );
        }


        // Find existing meeting:
        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(and(
                eq(meetingId, meetings.id),
                not(eq(meetings.status, "completed")),
                not(eq(meetings.status, "active")),
                not(eq(meetings.status, "cancelled")),
                not(eq(meetings.status, "processing")),
            ));

        // Check existing meeting:
        if (!existingMeeting) {
            return NextResponse.json(
                { error: "No such meeting found" },
                { status: 400 },
            );
        }

        // Change status to active and started:
        await db
            .update(meetings)
            .set({
                status: "active",
                startedAt: new Date(),
            })
            .where(eq(meetings.id, existingMeeting.id));

        // Find existing agent:
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        // Check if there is existing agent:
        if (!existingAgent) {
            console.log("No such agent");
            return NextResponse.json(
                { error: "No such agent found" },
                { status: 400 },
            );
        }

        const call = streamVideo.video.call("default", meetingId);

        const realtimeClient = await streamVideo.video.connectOpenAi({
            call,
            openAiApiKey: process.env.OPENAI_API_KEY!,
            agentUserId: existingAgent.id,
        });

        realtimeClient.updateSession({
            instructions: existingAgent.instruction,
        });

    } else if (eventType === "call.session_participant_left") {
        const event = payLoad as CallSessionParticipantLeftEvent;
        const meetingId = event.call_cid.split(":")[1];

        if (!meetingId) {
            return NextResponse.json(
                { error: "Missing meeting id" },
                { status: 400 },
            );
        }

        const call = streamVideo.video.call("default", meetingId);
        await call.end();


    } else if (eventType === "call.session_ended") {
        const event = payLoad as CallEndedEvent;
        const meetingId = event.call.custom?.meetingId;

        if (!meetingId) {
            return NextResponse.json(
                { error: "Missing meeting id" },
                { status: 400 },
            );
        }

        await db
            .update(meetings)
            .set({
                status: "processing",
                endedAt: new Date(),
            })
            .where(and(
                eq(meetings.id, meetingId),
                eq(meetings.status, "active")
            ));

    } else if (eventType === "call.transcription_ready") {
        const event = payLoad as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        const [updatedMeeting] = await db
            .update(meetings)
            .set({
                transcriptUrl: event.call_transcription.url,
            })
            .where(eq(meetings.id, meetingId))
            .returning();

        if (!updatedMeeting) {
            return NextResponse.json(
                { error: "Meeting not found" },
                { status: 404 },
            );
        }
        // Call ingest bg job to summarize:
        await inngest.send({
            name: "meetings/processing",
            data: {
                meetingId: updatedMeeting.id,
                transcriptUrl: updatedMeeting.transcriptUrl,
            },
        })

    } else if (eventType === "call.recording_ready") {
        const event = payLoad as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];

        await db
            .update(meetings)
            .set({
                recordingUrl: event.call_recording.url,
            })
            .where(eq(meetings.id, meetingId));

    } else if (eventType === "message.new") {
        const event = payLoad as MessageNewEvent;

        const userId = event.user?.id;
        const channelId = event.channel_id;
        const text = event.message?.text;

        if (!userId || !channelId || !text) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 404 },
            );
        }

        const [existingMeeting] = await db
            .select()
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, channelId), eq(meetings.status, "completed")
                )
            );

        if (!existingMeeting) {
            return NextResponse.json(
                { error: "Meeting not found" },
                { status: 404 },
            );
        }

        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(eq(agents.id, existingMeeting.agentId));

        if (!existingAgent) {
            return NextResponse.json(
                { error: "Agent not found" },
                { status: 404 },
            );
        }

        if (userId !== existingAgent.id) {
            const instructions = `
                You are an AI assistant helping the user revisit a recently completed meeting.
                Below is a summary of the meeting, generated from the transcript:
                
                ${existingMeeting.summary}
                
                The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
                
                ${existingAgent.instruction}
                
                The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
                Always base your responses on the meeting summary above.
                
                You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
                
                If the summary does not contain enough information to answer a question, politely let the user know.
                
                Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
                `;

            const channel = streamChat.channel("messaging", channelId);
            await channel.watch();

            const previousMessages = channel.state.messages.slice(-5).filter((msg) => msg.text && msg.text.trim() !== "").map<ChatCompletionMessageParam>((message) => ({
                role: message.user?.id === existingAgent?.id ? "assistant" : "user",
                content: message.text ?? "",
            }));

            const GPTresponse = await openAIClient.chat.completions.create({
                messages: [
                    { role: "system", content: instructions },
                    ...previousMessages,
                    { role: "user", content: text },
                ],
                model: "gpt-4o-mini"
            });

            const GPTresponseText = GPTresponse.choices[0].message.content;

            if (!GPTresponseText) {
                return NextResponse.json(
                    { error: "No response from GPT" },
                    { status: 400 },
                );
            }

            const avatarURL = generateAvatar({
                seed: existingAgent.name,
                variant: "botttsNeutral",
            });

            streamChat.upsertUser({
                id: existingAgent.id,
                name: existingAgent.name,
                image: avatarURL,
            });

            channel.sendMessage({
                text: GPTresponseText,
                user: {
                    id: existingAgent.id,
                    name: existingAgent.name,
                    image: avatarURL,
                }
            })
        }
    }

    return NextResponse.json({ status: "ok" });
}


