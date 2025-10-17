import { z } from "zod";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { meetingsInsertSchema, meetingUpdateSchema } from "../schemas";

export const meetingsRouter = createTRPCRouter({
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

                // TODO: Create Stream Call , Upsert Stream Users

                return createdMeeting;
            }),


    // READ:
    // Procedure to get all the Meetings for a user:
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish(),
        }))
        .query(async ({ input, ctx }) => {
            const { page, pageSize, search } = input;
            const data = await db
                .select({
                    ...getTableColumns(meetings),
                    meetingCount: sql<number>`10`,
                })
                .from(meetings)
                .where(and(
                    eq(meetings.userId, ctx.auth.user.id),
                    search ? ilike(meetings.name, `%${search}%`) : undefined,
                )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .where(and(
                    eq(meetings.userId, ctx.auth.user.id),
                    search ? ilike(meetings.name, `%${search}%`) : undefined,
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
                .select()
                .from(meetings)
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

});