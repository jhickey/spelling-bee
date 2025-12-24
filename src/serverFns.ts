import { createServerFn } from "@tanstack/react-start";
import {
  getGame,
  getLatestGame,
  getSession,
  prisma,
  updateSettings,
  upsertGameSession,
} from "./lib/database.ts";
import z from "zod";
import { notFound } from "@tanstack/react-router";
import authMiddleware from "@/middleware/authMiddleware.ts";
import { SettingsSchema, WordSchema } from "@/schemas/database.ts";
import { Prisma } from "@prisma/client";

const GameStateRequestSchema = z.object({
  gameId: z.string().optional(),
});

export const getServerUser = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { session } = context;
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
    });
    return { ...user, settings: SettingsSchema.parse(user.settings) };
  });

export const updateServerUserSettings = createServerFn()
  .inputValidator(SettingsSchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const {
      session: { user },
    } = context;
    return updateSettings(user.id, data);
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
      userId: context.session.user.id,
      gameId,
    });
  });

export const updateGameSession = createServerFn()
  .inputValidator(PostSessionBodySchema)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const { words, gameId } = data;
    await upsertGameSession({
      userId: context.session.user.id,
      gameId,
      words,
    });
    return await getSession({
      userId: context.session.user.id,
      gameId,
    });
  });

export type GameWithSessions = Prisma.GameGetPayload<{
  include: {
    sessions: {
      include: {
        words: true;
      };
    };
  };
}>;

export const getServerArchive = createServerFn()
  .middleware([authMiddleware])
  .handler(({ context }) => {
    return prisma.game.findMany({
      orderBy: {
        date: "desc",
      },
      include: {
        sessions: {
          where: {
            userId: context.session.user.id,
          },
          include: {
            words: true,
          },
        },
      },
    });
  });

export const getSessionOrRedirect = createServerFn()
  .middleware([authMiddleware])
  .handler(({ context }) => {
    return context.session;
  });
