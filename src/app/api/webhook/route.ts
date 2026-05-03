
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

import {
    CallEndedEvent,
    CallTranscriptionReadyEvent,
    CallRecordingReadyEvent,
    CallSessionStartedEvent,
    CallSessionParticipantLeftEvent,
    MessageNewEvent,
} from "@stream-io/node-sdk";

import { and, eq, not } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { streamVideo } from "@/lib/stream-video";
import { streamChat } from "@/lib/stream-chat";
import { generateAvatar } from "@/lib/avatar";
import { inngest } from "@/inngest/client";

const openAIClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

function verifySignatureWithSDK(body: string, signature: string): boolean {
    try {
        return streamVideo.verifyWebhook(body, signature);
    } catch (err) {
        console.error("verifySignatureWithSDK error:", err);
        return false;
    }
}

export async function POST(req: NextRequest) {
    const signature = req.headers.get("x-signature");
    const apiKey = req.headers.get("x-api-key");

    console.log("Webhook received. x-signature present:", !!signature, "x-api-key present:", !!apiKey);

    if (!signature || !apiKey) {
        console.error("Missing signature or api key header.");
        return NextResponse.json({ error: "Missing signature or API key" }, { status: 400 });
    }

    const body = await req.text();

    if (!verifySignatureWithSDK(body, signature)) {
        console.error("Invalid webhook signature.");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    let payLoad;
    try {
        payLoad = JSON.parse(body);
    } catch (err) {
        console.error("Failed to parse JSON body:", err);
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const eventType = payLoad?.type;
    console.log("Webhook event type:", eventType);

    // ------------------------------
    // call.session_started
    // ------------------------------
    if (eventType === "call.session_started") {
        try {
            const event = payLoad as CallSessionStartedEvent;
            console.log("call.session_started event:", JSON.stringify(event, null, 2));

            const meetingId = event.call?.custom?.meetingId;
            const callCid = event.call_cid;

            console.log("Parsed meetingId:", meetingId, "callCid:", callCid);

            if (!meetingId) {
                console.error("Missing meetingId in event.call.custom");
                return NextResponse.json({ error: "Missing meeting id" }, { status: 400 });
            }

            // Fetch meeting
            const [meeting] = await db
                .select()
                .from(meetings)
                .where(
                    and(
                        eq(meetings.id, meetingId),
                        not(eq(meetings.status, "completed")),
                        not(eq(meetings.status, "cancelled")),
                        not(eq(meetings.status, "processing"))
                    )
                );

            if (!meeting) {
                console.error("Meeting not found for id:", meetingId);
                return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
            }
            console.log("Meeting record found:", meeting.id);

            // Update meeting to active
            await db.update(meetings).set({ status: "active", startedAt: new Date() }).where(eq(meetings.id, meeting.id));
            console.log("Meeting status set to active for:", meeting.id);

            // Fetch agent
            const [agent] = await db.select().from(agents).where(eq(agents.id, meeting.agentId));
            if (!agent) {
                console.error("Agent not found for id:", meeting.agentId);
                return NextResponse.json({ error: "Agent not found" }, { status: 404 });
            }
            console.log("Agent found:", agent.id, agent.name);

            // Upsert agent user in Stream Chat
            const avatarURL = generateAvatar({ seed: agent.name, variant: "botttsNeutral" });
            try {
                const upsertRes = await streamChat.upsertUser({
                    id: agent.id,
                    name: agent.name,
                    image: avatarURL,
                });
                console.log("streamChat.upsertUser response:", upsertRes && typeof upsertRes === "object" ? "object" : upsertRes);
            } catch (err) {
                console.error("streamChat.upsertUser failed:", err);
                // continue—upsert failing is critical usually, but we'll still try connectOpenAi and log further
            }

            // Create call object
            const call = streamVideo.video.call("default", meetingId);
            console.log("Call object created for meetingId:", meetingId, "call:", !!call);

            // Connect OpenAI via Stream's convenience method
            let realtimeClient = null;
            try {
                realtimeClient = await streamVideo.video.connectOpenAi({
                    call,
                    openAiApiKey: process.env.OPENAI_API_KEY!,
                    agentUserId: agent.id,
                    model: "gpt-4o-realtime-preview-2024-12-17",
                    // validityInSeconds: 60 * 60 // optional
                });
                console.log("connectOpenAi succeeded. realtimeClient:", !!realtimeClient);
            } catch (err) {
                console.error("connectOpenAi failed:", err);
                return NextResponse.json({ error: "connectOpenAi failed", detail: String(err) }, { status: 500 });
            }

            // Defensive: log whether updateSession exists
            if (!realtimeClient || typeof realtimeClient.updateSession !== "function") {
                console.error("realtimeClient missing or doesn't support updateSession. realtimeClient:", realtimeClient);
                return NextResponse.json({ error: "Invalid realtime client" }, { status: 500 });
            }

            // Update session to enable audio + VAD
            try {
                await realtimeClient.updateSession({
                    instructions: agent.instruction,
                    modalities: ["audio", "text"],
                    input_audio_format: "pcm16",
                    output_audio_format: "pcm16",
                    turn_detection: {
                        type: "server_vad",
                        threshold: 0.5,
                    },
                });
                console.log("realtimeClient.updateSession succeeded.");
            } catch (err) {
                console.error("realtimeClient.updateSession failed:", err);
                // if this fails, agent will be silent — return error so you can see logs
                return NextResponse.json({ error: "updateSession failed", detail: String(err) }, { status: 500 });
            }

            console.log("Agent should now be active in call (if Stream integration & keys are correct).");
            return NextResponse.json({ status: "agent_connected" });
        } catch (err) {
            console.error("Unhandled error in call.session_started handler:", err);
            return NextResponse.json({ error: "internal_error", detail: String(err) }, { status: 500 });
        }
    }

    // ------------------------------
    // call.session_participant_left
    // ------------------------------
    if (eventType === "call.session_participant_left") {
        try {
            const event = payLoad as CallSessionParticipantLeftEvent;
            console.log("call.session_participant_left:", JSON.stringify(event, null, 2));
            const meetingId = event.call_cid?.split?.(":")?.[1];
            if (meetingId) {
                const call = streamVideo.video.call("default", meetingId);
                try {
                    await call.end();
                    console.log("call.end() invoked for meetingId:", meetingId);
                } catch (err) {
                    console.error("call.end() failed:", err);
                }
            }
            return NextResponse.json({ status: "ok" });
        } catch (err) {
            console.error("Error handling participant left:", err);
            return NextResponse.json({ error: String(err) }, { status: 500 });
        }
    }

    // ------------------------------
    // call.session_ended
    // ------------------------------
    if (eventType === "call.session_ended") {
        try {
            const event = payLoad as CallEndedEvent;
            console.log("call.session_ended:", JSON.stringify(event, null, 2));
            const meetingId = event.call?.custom?.meetingId;
            await db.update(meetings).set({ status: "processing", endedAt: new Date() }).where(eq(meetings.id, meetingId));
            return NextResponse.json({ status: "ok" });
        } catch (err) {
            console.error("Error handling session_ended:", err);
            return NextResponse.json({ error: String(err) }, { status: 500 });
        }
    }

    // ------------------------------
    // call.transcription_ready
    // ------------------------------
    if (eventType === "call.transcription_ready") {
        try {
            const event = payLoad as CallTranscriptionReadyEvent;
            console.log("call.transcription_ready:", JSON.stringify(event, null, 2));
            const meetingId = event.call_cid?.split?.(":")?.[1];
            const url = event.call_transcription?.url;
            if (!meetingId) return NextResponse.json({ error: "Missing meeting id" }, { status: 400 });
            const [updated] = await db.update(meetings).set({ transcriptUrl: url }).where(eq(meetings.id, meetingId)).returning();
            if (!updated) return NextResponse.json({ error: "Meeting not found" }, { status: 404 });
            await inngest.send({ name: "meetings/processing", data: { meetingId: updated.id, transcriptUrl: updated.transcriptUrl } });
            return NextResponse.json({ status: "transcription_saved" });
        } catch (err) {
            console.error("Error handling transcription_ready:", err);
            return NextResponse.json({ error: String(err) }, { status: 500 });
        }
    }

    // ------------------------------
    // call.recording_ready
    // ------------------------------
    if (eventType === "call.recording_ready") {
        try {
            const event = payLoad as CallRecordingReadyEvent;
            console.log("call.recording_ready:", JSON.stringify(event, null, 2));
            const meetingId = event.call_cid?.split?.(":")?.[1];
            const url = event.call_recording?.url;
            await db.update(meetings).set({ recordingUrl: url }).where(eq(meetings.id, meetingId));
            return NextResponse.json({ status: "recording_saved" });
        } catch (err) {
            console.error("Error handling recording_ready:", err);
            return NextResponse.json({ error: String(err) }, { status: 500 });
        }
    }

    // ------------------------------
    // message.new (post-meeting chat)
    // ------------------------------
    if (eventType === "message.new") {
        try {
            const event = payLoad as MessageNewEvent;
            console.log("message.new payload:", JSON.stringify(event, null, 2));
            const text = event.message?.text;
            const userId = event.user?.id;
            const channelId = event.channel_id;

            if (!text || !userId || !channelId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

            const [meeting] = await db.select().from(meetings).where(and(eq(meetings.id, channelId), eq(meetings.status, "completed")));
            if (!meeting) return NextResponse.json({ error: "Meeting not complete or not found" }, { status: 400 });

            const [agent] = await db.select().from(agents).where(eq(agents.id, meeting.agentId));
            if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

            if (userId === agent.id) {
                console.log("Ignoring message from agent itself.");
                return NextResponse.json({ status: "ignored" });
            }

            const channel = streamChat.channel("messaging", channelId);
            await channel.watch();

            const previousMessages = channel.state.messages.slice(-5).map<ChatCompletionMessageParam>((m) => ({
                role: m.user?.id === agent.id ? "assistant" : "user",
                content: m.text ?? "",
            }));

            const instructions = `
You are an AI assistant helping the user revisit a completed meeting.
Meeting summary:
${meeting.summary}

Agent instructions:
${agent.instruction}
`;

            const response = await openAIClient.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "system", content: instructions }, ...previousMessages, { role: "user", content: text }],
            });

            const reply = response.choices?.[0]?.message?.content;
            console.log("OpenAI reply:", reply?.slice?.(0, 200) ?? reply);

            const avatar = generateAvatar({ seed: agent.name, variant: "botttsNeutral" });
            await streamChat.upsertUser({ id: agent.id, name: agent.name, image: avatar });

            await channel.sendMessage({
                text: reply ?? "Sorry — I couldn't generate a reply.",
                user: { id: agent.id, name: agent.name, image: avatar },
            });

            return NextResponse.json({ status: "reply_sent" });
        } catch (err) {
            console.error("Error handling message.new:", err);
            return NextResponse.json({ error: String(err) }, { status: 500 });
        }
    }

    // default
    console.log("Unhandled event type:", eventType);
    return NextResponse.json({ status: "ignored" });
}

