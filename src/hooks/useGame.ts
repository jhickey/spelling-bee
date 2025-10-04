import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  calculatePoints,
  calculateRankingLevel,
  getHints,
} from "../utils/game";
import {
  ANIMATION_DURATION,
  MAX_WORD_LENGTH,
  MIN_WORD_LENGTH,
  rankingLevels,
} from "../constants";
import { RankingLevel } from "../types";
import { ZGame, ZGameSession, ZWord } from "../schemas/database";

function getDefaultGameState(): GameState {
  return {
    game: {
      id: "",
      date: new Date(),
      letters: [],
      centerLetter: "",
      answers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    session: {
      id: "",
      words: [],
      userId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    pangrams: [],
    userPoints: 0,
    totalPoints: 0,
    showRemainingStarts: false,
    showRemainingTotals: false,
    rankingLevel: rankingLevels[0],
    hints: { remainingStarts: {}, remainingTotals: {} },
  };
}

export interface Hints {
  remainingStarts: Record<string, number>;
  remainingTotals: Record<string, number>;
}

export interface GameState {
  game: ZGame;
  session: ZGameSession;
  pangrams: ZWord[];
  userPoints: number;
  totalPoints: number;
  hints: Hints;
  showRemainingStarts: boolean;
  showRemainingTotals: boolean;
  rankingLevel: RankingLevel;
}

enum GameActionType {
  INIT = "INIT",
  UPDATE_FOUND_WORDS = "UPDATE_FOUND_WORDS",
}
type GameAction = {
  type: GameActionType;
  payload: { word: ZWord };
};

export const GameContext = createContext<GameState>(getDefaultGameState());

function gameReducer(
  state: GameState = getDefaultGameState(),
  action: GameAction,
): GameState {
  switch (action.type) {
    case GameActionType.INIT: {
      const pangrams = state.game.answers.filter((word) =>
        state.game.letters.every((vl) => word.value.includes(vl)),
      );
      const userPoints = calculatePoints(
        state.session.words,
        state.game.letters,
      );
      const totalPoints = calculatePoints(
        state.game.answers,
        state.game.letters,
      );
      const hints = getHints(state.session.words, state.game.answers);
      const rankingLevel = calculateRankingLevel(userPoints, totalPoints);
      const showRemainingStarts = rankingLevel.index >= 4;
      const showRemainingTotals = rankingLevel.index >= 8;

      return {
        ...state,
        pangrams,
        userPoints,
        totalPoints,
        hints,
        rankingLevel,
        showRemainingStarts,
        showRemainingTotals,
      };
    }
    case GameActionType.UPDATE_FOUND_WORDS: {
      const updatedFoundWords = [...state.session.words, action.payload.word];
      const updatedUserPoints = calculatePoints(
        updatedFoundWords,
        state.game.letters,
      );
      const updatedHints = getHints(updatedFoundWords, state.game.answers);
      const updatedRankingLevel = calculateRankingLevel(
        updatedUserPoints,
        state.totalPoints,
      );
      const showRemainingStarts = updatedRankingLevel.index >= 4;
      const showRemainingTotals = updatedRankingLevel.index >= 8;

      return {
        ...state,
        session: { ...state.session, words: updatedFoundWords },
        userPoints: updatedUserPoints,
        hints: updatedHints,
        rankingLevel: updatedRankingLevel,
        showRemainingStarts,
        showRemainingTotals,
      };
    }
    default:
      return state;
  }
}

export default function useGame() {
  const gameContext = useContext(GameContext);
  const [gameState, dispatch] = useReducer(gameReducer, gameContext);

  useEffect(() => {
    dispatch({ type: GameActionType.INIT, payload: { word: "" } });
  }, [gameContext.game.id]);

  const [inputWord, setInputWord] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  const [wordPointValue, setWordPointValue] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | undefined>(
    undefined,
  );

  const displayMessage = (message: string) => {
    setMessage(message);
    setTimeout(() => setMessage(null), ANIMATION_DURATION);
  };

  const displayError = (message: string) => {
    displayMessage(message);
    setError(true);
    const timeout = setTimeout(() => {
      setInputWord("");
      setError(false);
    }, ANIMATION_DURATION);
    setErrorTimeout(timeout);
  };

  const handleInput = (inputWord: string) => {
    if (error) {
      clearTimeout(errorTimeout);
      setErrorTimeout(undefined);
      setMessage(null);
      setInputWord(inputWord.slice(-1));
      setError(false);
      return;
    }
    setInputWord(inputWord);
    if (inputWord.length >= MAX_WORD_LENGTH) {
      displayError("Too long");
    }
  };

  const handleSubmit = (word: string): void => {
    const wordObj = gameContext.game.answers.find(
      (w) => w.value === word.toLowerCase(),
    );
    if (word.length < MIN_WORD_LENGTH) {
      displayError("Too short");
    } else if (
      gameContext.session.words.find((w) => w.value === word.toLowerCase())
    ) {
      displayError("Already found");
    } else if (wordObj) {
      dispatch({
        type: GameActionType.UPDATE_FOUND_WORDS,
        payload: { word: wordObj },
      });
      fetch("/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          words: [...gameState.session.words, wordObj],
          gameId: gameState.game.id,
        }),
      }).catch((e) => {
        console.error("Failed to save session:", e);
      });
      if (
        gameContext.pangrams.map((w) => w.value).includes(word.toLowerCase())
      ) {
        setReaction("Pangram!");
        setTimeout(() => setReaction(null), ANIMATION_DURATION);
      }
      setWordPointValue(calculatePoints([wordObj], gameContext.game.letters));
      setTimeout(() => setWordPointValue(null), ANIMATION_DURATION);
      setInputWord("");
    } else {
      displayError("Not in word list");
    }
  };

  return {
    gameState,
    inputWord,
    handleInput,
    handleSubmit,
    wordPointValue,
    message,
    reaction,
    error,
  };
}
