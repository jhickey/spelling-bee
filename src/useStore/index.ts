import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { RankingLevel } from '../types';
import {
  calculatePangram,
  calculatePoints,
  calculateRankingLevel,
  getHints,
} from '../utils/game';

interface GameData {
  displayWeekday: string;
  displayDate: string;
  printDate: string;
  centerLetter: string;
  outerLetters: string[];
  validLetters: string[];
  pangrams: string[];
  answers: string[];
  id: string;
  freeExpiration: string;
  editor: string;
  foundWords: string[];
  userPoints: number;
  hints: Hints;
  showRemainingStarts: boolean;
  showRemainingTotals: boolean;
}
export interface GameState extends GameData {
  isPangram: (answer: string) => boolean;
  getPoints: (wordList?: string[]) => number;
  getRankingLevel: () => RankingLevel;
  updateFoundWords: (wordList: string[]) => void;
}

export interface Hints {
  remainingStarts: Record<string, number>;
  remainingTotals: Record<string, number>;
}

const useStore = create<GameState>()(
  immer((set, get) => ({
    displayWeekday: '',
    displayDate: '',
    printDate: '',
    centerLetter: '',
    outerLetters: [],
    validLetters: [],
    pangrams: [],
    answers: [],
    id: '',
    freeExpiration: '',
    editor: '',
    userPoints: 0,
    foundWords: [],
    showRemainingStarts: true,
    showRemainingTotals: true,
    hints: { remainingStarts: {}, remainingTotals: {} },
    getPoints: (wordList = get().answers) => {
      const { validLetters } = get();
      return calculatePoints(wordList, validLetters);
    },
    isPangram: (word) => {
      const { validLetters } = get();
      return calculatePangram(word, validLetters);
    },
    getRankingLevel: () => {
      return calculateRankingLevel(get().userPoints, get().getPoints());
    },
    updateFoundWords: (wordList) => {
      set((state) => {
        const points = get().getPoints(wordList);
        state.foundWords = wordList;
        state.userPoints = points;
        state.hints = getHints(wordList, state.answers);
        const rankingLevel = calculateRankingLevel(points, get().getPoints());
        if (rankingLevel.index >= 4) {
          state.showRemainingStarts = true;
        }
        if (rankingLevel.index >= 8) {
          state.showRemainingTotals = true;
        }
      });
      fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ words: wordList, gameId: get().id }),
      });
    },
  }))
);

export default useStore;
