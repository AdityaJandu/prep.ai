import { z } from "zod";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema, agentUpdateSchema } from "../schemas";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";

export const agentsRouter = createTRPCRouter({
    // CREATE:
    // Create a new Agent with protected procedure:
    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(
            async ({ input, ctx }) => {
                const [createdAgent] = await db
                    .insert(agents)
                    .values({
                        ...input,
                        userId: ctx.auth.user.id,
                    })
                    .returning();

                return createdAgent;
            }),

    // READ:
    // Procedure to get all the Agents for a user:
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
                    ...getTableColumns(agents),
                    meetingCount: sql<number>`10`,
                })
                .from(agents)
                .where(and(
                    eq(agents.userId, ctx.auth.user.id),
                    search ? ilike(agents.name, `%${search}%`) : undefined,
                )
                )
                .orderBy(desc(agents.createdAt), desc(agents.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db
                .select({ count: count() })
                .from(agents)
                .where(and(
                    eq(agents.userId, ctx.auth.user.id),
                    search ? ilike(agents.name, `%${search}%`) : undefined,
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
    // Procedure to get a single agent for any user:
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingAgent] = await db
                .select(
                    {
                        ...getTableColumns(agents),
                        meetingCount: sql<number>`10`,
                    }
                )
                .from(agents)
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id)
                    )
                );

            if (!existingAgent) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found or you don't have access to it.",
                });
            }

            return existingAgent;

        }),

    // UPDATE:
    update: protectedProcedure
        .input(agentUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            const [updatedAgent] = await db
                .update(agents)
                .set(input)
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id)
                    )
                ).returning();

            if (!updatedAgent) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found or you don't have access to it.",
                });
            }

            return updatedAgent;
        }),




    // DELETE:
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(
            async ({ input, ctx }) => {
                const [removedAgent] = await db
                    .delete(agents)
                    .where(
                        and(
                            eq(agents.id, input.id),
                            eq(agents.userId, ctx.auth.user.id)
                        ),
                    ).returning();

                if (!removedAgent) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Agent not found or you don't have access to it.",
                    });
                }
                return removedAgent;
            }),

});