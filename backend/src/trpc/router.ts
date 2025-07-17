import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { prisma } from '../prismaclient.js';


const t = initTRPC.create();
const publicProcedure = t.procedure;

export const appRouter = t.router({
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
 setItemDiscovered: publicProcedure
    .input(
      z.object({
        id: z.number(),
        discovered: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.item.update({
        where: { id: input.id },
        data: { discovered: input.discovered },
      });
    }),
    
});

export type AppRouter = typeof appRouter;

