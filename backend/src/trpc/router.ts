import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { PrismaClient } from '../../generated/prisma';

export const prisma = new PrismaClient();

const t = initTRPC.create();
const publicProcedure = t.procedure;

export const appRouter = t.router({
  foo: publicProcedure.query(() => {
    return 'Hello from tRPC!';
  }),
  getRecipes: publicProcedure.query(async () => {
    return prisma.recipe.findMany();
  }),

  createRecipe: publicProcedure
    .input(
      z.object({
        ingredientA: z.string(),
        ingredientB: z.string(),
        result: z.string(),
        emote: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.recipe.create({ data: input });
    }),

  getItems: publicProcedure.query(async () => {
    return prisma.item.findMany();
  }),

  createItem: publicProcedure
    .input(
      z.object({
        name: z.string(),
        emote: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.item.create({ data: input });
    }),
});

export type AppRouter = typeof appRouter;
