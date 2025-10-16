import { z } from "zod";
import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const agentsRouter = createTRPCRouter({
    // We'll create with protected one:
    getMany: protectedProcedure.query(async ({ input, ctx }) => {
        const data = await db
            .select()
            .from(agents)
            .where(eq(agents.userId, ctx.auth.user.id));

        return data;
    }),

    // GetOne Procedure:
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        const [existingAgent] = await db
            .select()
            .from(agents)
            .where(
                and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id))
            );

        if (!existingAgent) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Agent not found or you don't have access to it.",
            });
        }

        return existingAgent;

    }),



    // Create with protected procedure:
    create: protectedProcedure.input(agentsInsertSchema).mutation(
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
});