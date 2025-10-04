import { createServerFn } from "@tanstack/react-start";
import { getGame, getLatestGame, getSession } from "./utils/database";
import { calculatePoints, calculateRankingLevel, getHints } from "./utils/game";
import { GameState } from "./hooks/useGame";
import z from "zod";
import { notFound } from "@tanstack/react-router";
import authMiddleware from "@/middleware/authMiddleware.ts";

const GameStateRequestSchema = z.object({
  gameId: z.string().optional(),
});

export const getGameState = createServerFn()
  .middleware([authMiddleware])
  .inputValidator(GameStateRequestSchema)
  .handler(async ({ data, context }) => {
    const { gameId } = data;
    const { userId } = context;

    const game = gameId ? await getGame(gameId) : await getLatestGame();
    if (!game) {
      throw notFound();
    }

    const session = await getSession({
      gameId: game.id,
      userId,
    });
    const userPoints = calculatePoints(session.words, game.letters);
    const totalPoints = calculatePoints(game.answers, game.letters);
    const rankingLevel = calculateRankingLevel(userPoints, totalPoints);

    return {
      game,
      session,
      pangrams: game.answers.filter((word) =>
        game.letters.every((vl) => word.value.includes(vl)),
      ),
      userPoints,
      totalPoints,
      hints: getHints(session.words, game.answers),
      rankingLevel,
      showRemainingStarts: rankingLevel.index >= 4,
      showRemainingTotals: rankingLevel.index >= 8,
    } as GameState;
  });
