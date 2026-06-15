import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  cases: router({
    list: publicProcedure.query(async () => {
      const allCases = await db.getAllCases();
      return allCases;
    }),
    getSkins: publicProcedure
      .input(z.object({ caseId: z.number() }))
      .query(async ({ input }) => {
        return db.getSkinsByCaseId(input.caseId);
      }),
  }),

  keys: router({
    getBalance: protectedProcedure
      .input(z.object({ caseId: z.number() }))
      .query(async ({ ctx, input }) => {
        const balance = await db.getUserKeyBalance(ctx.user.id, input.caseId);
        return { balance };
      }),
    getAllBalances: protectedProcedure.query(async ({ ctx }) => {
      const allKeys = await db.getUserAllKeys(ctx.user.id);
      return allKeys;
    }),
  }),

  inventory: router({
    getInventory: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserInventory(ctx.user.id);
    }),
  }),

  aimTrainer: router({
    submitScore: protectedProcedure
      .input(
        z.object({
          score: z.number(),
          targetsHit: z.number(),
          totalTargets: z.number(),
          accuracy: z.number(),
          caseId: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const keysEarned = Math.floor(input.score / 10);
        const caseId = input.caseId || 1;

        await db.saveAimTrainerScore(
          ctx.user.id,
          input.score,
          input.targetsHit,
          input.totalTargets,
          input.accuracy,
          keysEarned,
          caseId
        );

        if (keysEarned > 0) {
          await db.addKeys(ctx.user.id, caseId, keysEarned);
        }

        return { keysEarned, success: true };
      }),
  }),

  caseOpening: router({
    openCase: protectedProcedure
      .input(z.object({ caseId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const hasKey = await db.consumeKey(ctx.user.id, input.caseId);
        if (!hasKey) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Not enough keys" });
        }

        const caseSkins = await db.getSkinsByCaseId(input.caseId);
        if (caseSkins.length === 0) {
          throw new TRPCError({ code: "NOT_FOUND", message: "No skins found for this case" });
        }

        const pool: any[] = [];
        caseSkins.forEach((skin) => {
          const weight = skin.weight || 1;
          for (let i = 0; i < weight; i++) {
            pool.push(skin);
          }
        });

        const wonSkin = pool[Math.floor(Math.random() * pool.length)];

        await db.addToInventory(ctx.user.id, wonSkin.id, input.caseId);

        return {
          success: true,
          skin: wonSkin,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
