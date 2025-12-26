import { useMemo } from "react";
import {
  calculatePoints,
  calculateRankingLevel,
  getHints,
} from "../utils/game";
import { RankingLevel } from "../types";
import { ZWord } from "../schemas/database";
import {
  getServerGameSession,
  getServerGameState,
  updateGameSession,
} from "@/serverFns";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useUser } from "@/hooks/useUser";

export interface Hints {
  remainingStarts: Record<string, number>;
  remainingTotals: Record<string, number>;
}

export interface GameState {
  pangrams: ZWord[];
  userPoints: number;
  totalPoints: number;
  hints: Hints | null;
  showRemainingStarts: boolean;
  showRemainingTotals: boolean;
  rankingLevel: RankingLevel;
}

export default function useGame() {
  const { gameId } = useParams({ strict: false });
  const queryClient = useQueryClient();

  const getGame = useServerFn(getServerGameState);
  const getSession = useServerFn(getServerGameSession);
  const updateSession = useServerFn(updateGameSession);

  const {
    isLoading: isGameLoading,
    error: gameError,
    data: game,
  } = useQuery({
    queryKey: ["game"],
    queryFn: () => getGame({ data: { gameId } }),
  });

  const {
    isLoading: isSessionLoading,
    error: sessionError,
    data: session,
  } = useQuery({
    queryKey: ["session", gameId],
    queryFn: () => getSession({ data: { gameId: game?.id || "" } }),
    enabled: !!game?.id,
  });
  const { data: userData } = useUser();

  const { mutate } = useMutation({
    mutationFn: (data: { gameId: string; words: ZWord[] }) =>
      updateSession({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });

  if (gameError || sessionError) {
    console.error(gameError || sessionError);
  }

  const userPoints = useMemo(
    () => (session && game ? calculatePoints(session.words, game.letters) : 0),
    [session?.id, session?.words.length, game?.id],
  );

  const { totalPoints, pangrams } = useMemo(() => {
    const totalPoints = game ? calculatePoints(game.answers, game.letters) : 0;
    const pangrams = game
      ? game.answers.filter((word) =>
          game.letters.every((vl) => word.value.includes(vl)),
        )
      : [];
    return { totalPoints, pangrams };
  }, [game?.id]);

  const hints = useMemo(() => {
    return session && game ? getHints(session.words, game.answers) : null;
  }, [session?.id, game?.id, session?.words.length]);

  const rankingLevel = useMemo(
    () => calculateRankingLevel(userPoints, totalPoints),
    [userPoints, game?.id],
  );

  const { showRemainingStarts, showRemainingTotals } = useMemo(() => {
    return {
      showRemainingStarts: userData?.settings
        ? rankingLevel.index >= userData.settings.showStartingLetterHints
        : false,
      showRemainingTotals: userData?.settings
        ? rankingLevel.index >= userData.settings.showRemainingLetterHints
        : false,
    };
  }, [rankingLevel.index, userData?.settings]);

  const gameState: GameState = {
    userPoints,
    totalPoints,
    pangrams,
    hints,
    rankingLevel,
    showRemainingStarts,
    showRemainingTotals,
  };

  return {
    isLoading: isGameLoading || isSessionLoading,
    error: gameError || sessionError,
    game,
    session,
    gameState,
    updateSession: mutate,
  };
}
