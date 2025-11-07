import { z } from "zod";
import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, count, desc, eq, getTableColumns, ilike, inArray, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { meetingsInsertSchema, meetingUpdateSchema } from "../schemas";
import { MeetingStatus, StreamTranscription } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatar } from "@/lib/avatar";
import JSONL from "jsonl-parse-stringify";
import { streamChat } from "@/lib/stream-chat";

export const meetingsRouter = createTRPCRouter({
    // Generate Chat Tokens:
    // For chat ASK AI:
    generateChatToken: protectedProcedure.mutation(async ({ ctx }) => {
        const token = streamChat.createToken(ctx.auth.user.id);

        await streamChat.upsertUser({
            id: ctx.auth.user.id,
            role: "admin",
        });

        return token;
    }),

    // Transcript Procedure:
    // Get the transcript procedure:
    getTranscript: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingMeeting] = await db
                .select()
                .from(meetings).where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id)
                    )
                );

            if (!existingMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting is not found",
                });
            };

            if (!existingMeeting.transcriptUrl) {
                return [];
            }

            const transcript = await fetch(existingMeeting.transcriptUrl)
                .then((res) => res.text())
                .then((text) => JSONL.parse<StreamTranscription>(text))
                .catch(() => {
                    return [];
                });

            const speakerIds = [
                ...new Set(transcript.map((item) => item.speaker_id))
            ];

            const userSpeakers = await db
                .select()
                .from(user)
                .where(inArray(user.id, speakerIds))
                .then(
                    (users) => users.map((user) => ({
                        ...user,
                        image: user.image ?? generateAvatar({ seed: user.name, variant: "initials" }),
                    }))
                );

            const agentSpeakers = await db
                .select()
                .from(agents)
                .where(inArray(agents.id, speakerIds))
                .then(
                    (agents) => agents.map((agent) => ({
                        ...agent,
                        image: generateAvatar({ seed: agent.name, variant: "botttsNeutral" }),
                    }))
                );

            const speakers = [...userSpeakers, ...agentSpeakers];

            const transcriptWithSpeakers = transcript.map((item) => {
                const speaker = speakers.find(
                    (speaker) => speaker.id === item.speaker_id
                );

                if (!speaker) {
                    return {
                        ...item,
                        user: {
                            name: "Unknown",
                            image: generateAvatar({ seed: "unknown", variant: "initials" }),
                        }
                    };
                };

                return {
                    ...item,
                    user: {
                        name: speaker.name,
                        image: speaker.image,
                    }
                };

            });

            return transcriptWithSpeakers;
        }),

    // Generate Token:
    // For stream video:
    generateToken: protectedProcedure
        .mutation(async ({ ctx }) => {
            await streamVideo.upsertUsers([
                {
                    id: ctx.auth.user.id,
                    name: ctx.auth.user.name,
                    role: "admin",
                    image:
                        ctx.auth.user.image
                        ?? generateAvatar({ seed: ctx.auth.user.name, variant: "initials" })
                }
            ]);

            const expiration = Math.floor(Date.now() / 1000) * 3600;
            const issuedAt = Math.floor(Date.now() / 1000) - 60;

            const generatedToken = streamVideo.generateUserToken({
                user_id: ctx.auth.user.id,
                validity_in_seconds: issuedAt,
                exp: expiration,
            });

            return generatedToken;
        }),


    // CREATE:
    // Create a new meeting with protected procedure:
    create: protectedProcedure
        .input(meetingsInsertSchema)
        .mutation(
            async ({ input, ctx }) => {
                const [createdMeeting] = await db
                    .insert(meetings)
                    .values({
                        ...input,
                        userId: ctx.auth.user.id,
                    })
                    .returning();

                if (!createdMeeting) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Meeting not found or you don't have access to it.",
                    });
                }

                // Create Stream Call , Upsert Stream Users
                const callType = 'default';
                const callId = createdMeeting.id;

                const call = streamVideo.video.call(callType, callId);


                await call.create({
                    data: {
                        created_by_id: ctx.auth.user.id,
                        custom: {
                            meetingId: createdMeeting.id,
                            meetingName: createdMeeting.name,
                        },

                        settings_override: {
                            transcription: {
                                language: "en",
                                mode: "auto-on",
                                closed_caption_mode: "auto-on",
                            },

                            recording: {
                                mode: "auto-on",
                                quality: "1080p",
                            },
                        },
                    },
                });

                const [existingAgent] = await db
                    .select()
                    .from(agents)
                    .where(
                        eq(agents.id, createdMeeting.agentId)
                    );


                if (!existingAgent) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Agent not found or you don't have access to it.",
                    });
                }

                await streamVideo.upsertUsers([
                    {
                        id: existingAgent.id,
                        name: existingAgent.name,
                        role: "user",
                        image: generateAvatar({ seed: existingAgent.name, variant: "botttsNeutral" }),
                    }
                ]);

                return createdMeeting;
            }),


    // READ:
    // Procedure to get all the Meetings for a user:
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish(),
            agentId: z.string().nullish(),
            status: z.enum([
                MeetingStatus.Active,
                MeetingStatus.Processing,
                MeetingStatus.Upcoming,
                MeetingStatus.Completed,
                MeetingStatus.Cancelled,
            ]).nullish(),
        }))
        .query(async ({ input, ctx }) => {
            const { page, pageSize, search, status, agentId } = input;
            const data = await db
                .select({
                    ...getTableColumns(meetings),
                    agent: agents,
                    duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
                })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                        agentId ? eq(meetings.agentId, agentId) : undefined,
                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status ? eq(meetings.status, status) : undefined,
                        agentId ? eq(meetings.agentId, agentId) : undefined,
                    )
                );

            const totalPages = Math.ceil(total.count / pageSize);

            return {
                items: data,
                total: total.count,
                totalPages,
            };
        }),

    // READ:
    // Procedure to get a single meeting for any user:
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingMeeting] = await db
                .select(
                    {
                        ...getTableColumns(meetings),
                        agent: agents,
                        duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as("duration"),
                    }
                )
                .from(meetings)
                .innerJoin(agents, eq(meetings.agentId, agents.id))
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id)
                    )
                );

            if (!existingMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found or you don't have access to it.",
                });
            }

            return existingMeeting;

        }),

    // UPDATE:
    update: protectedProcedure
        .input(meetingUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            const [updatedMeeting] = await db
                .update(meetings)
                .set(input)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id)
                    )
                ).returning();

            if (!updatedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found or you don't have access to it.",
                });
            }

            return updatedMeeting;
        }),


    // DELETE:
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const [removedMeeting] = await db
                .delete(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id)
                    )
                ).returning();

            if (!removedMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Meeting not found or you don't have access to it.",
                });
            }

            return removedMeeting;
        })

});