import { createServerFn } from "@tanstack/react-start";
import {
  getGame,
  getLatestGame,
  getSession,
  prisma,
  upsertGameSession,
} from "./utils/database";
import z from "zod";
import { notFound } from "@tanstack/react-router";
import authMiddleware from "@/middleware/authMiddleware.ts";
import { WordSchema } from "@/schemas/database.ts";

const GameStateRequestSchema = z.object({
  gameId: z.string().optional(),
});

export const getServerGameState = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(GameStateRequestSchema)
  .handler(async ({ data }) => {
    const { gameId } = data;

    const game = gameId ? await getGame(gameId) : await getLatestGame();
    if (!game) {
      throw notFound();
    }

    return game;
  });

const PostSessionBodySchema = z.object({
  gameId: z.string(),
  words: WordSchema.array(),
});

export const getServerGameSession = createServerFn()
  .inputValidator(
    z.object({
      gameId: z.string(),
    }),
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data: { gameId } }) => {
    return getSession({
      userId: context.userId,
      gameId,
    });
  });

export const updateGameSession = createServerFn()
  .inputValidator(PostSessionBodySchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const { words, gameId } = data;
    await upsertGameSession({
      userId: context.userId,
      gameId,
      words,
    });
    return await getSession({
      userId: context.userId,
      gameId,
    });
  });

export const getServerArchive = createServerFn()
  .middleware([authMiddleware])
  .handler(() => {
    return prisma.game.findMany({
      orderBy: {
        date: "desc",
      },
    });
  });
