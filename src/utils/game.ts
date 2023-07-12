import { rankingLevels } from '../constants';

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
