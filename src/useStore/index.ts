import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { RankingLevel } from '../types';
import { calculatePangram, calculateRankingLevel } from '../utils/game';

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
}
export interface GameState extends GameData {
  isPangram: (answer: string) => boolean;
  getPoints: (wordList?: string[]) => number;
  getRankingLevel: () => RankingLevel;
  updateFoundWords: (wordList: string[]) => void;
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
    getPoints: (wordList = get().answers) => {
      const { isPangram } = get();
      return wordList.reduce((points, answer) => {
        points +=
          answer.length === 4
            ? 1
            : isPangram(answer)
            ? answer.length + 7
            : answer.length;
        return points;
      }, 0);
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
        state.foundWords = wordList;
        state.userPoints = get().getPoints(wordList);
      });
      fetch('/api/game', {
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
