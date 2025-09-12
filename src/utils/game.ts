import { rankingLevels } from '../constants';
import { Hints } from '../useStore';

export const getRange = (start: number, end: number): number[] => {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};

export const calculateRankingPoints = (multiplier: number, points: number) => {
  return Math.round(points * (multiplier / 100));
};

export const calculateRankingLevel = (points: number, totalPoints: number) => {
  return rankingLevels.reduce((acc, rl) => {
    if (points >= calculateRankingPoints(rl.multiplier, totalPoints)) {
      acc = rl;
    }
    return acc;
  }, rankingLevels[0]);
};

export const calculatePangram = (word: string, validLetters: string[]) => {
  return validLetters.every((vl) => word.includes(vl));
};

export const calculatePoints = (wordList: string[], validLetters: string[]) => {
  return wordList.reduce((points, answer) => {
    points +=
      answer.length === 4
        ? 1
        : calculatePangram(answer.toLowerCase(), validLetters)
        ? answer.length + 7
        : answer.length;
    return points;
  }, 0);
};

export function getHints(foundWords: string[], answers: string[]): Hints {
  const answersLeft = answers.filter(
    (a) => !foundWords.includes(a.toUpperCase())
  );
  return answersLeft
    .map((a) => a.toUpperCase())
    .reduce<Hints>(
      (acc, answer) => {
        const firstLetter = answer[0];
        if (firstLetter in acc.remainingStarts) {
          acc.remainingStarts[firstLetter] += 1;
        } else {
          acc.remainingStarts[firstLetter] = 1;
        }
        answer.split('').forEach((letter) => {
          if (letter in acc.remainingTotals) {
            acc.remainingTotals[letter] += 1;
          } else {
            acc.remainingTotals[letter] = 1;
          }
        });
        return acc;
      },
      { remainingStarts: {}, remainingTotals: {} }
    );
}
