import { RankingLevel } from "./types";

export const MAX_WORD_LENGTH = 20;
export const MIN_WORD_LENGTH = 4;
export const ANIMATION_DURATION = 750;

enum RankingLevelIndex {
  Beginner,
  GoodStart,
  MovingUp,
  Good,
  Solid,
  Nice,
  Great,
  Amazing,
  Genius,
}

export const rankingLevels: RankingLevel[] = [
  {
    name: "Beginner",
    multiplier: 0,
    index: RankingLevelIndex.Beginner,
  },
  {
    name: "Good Start",
    multiplier: 2,
    index: RankingLevelIndex.GoodStart,
  },
  {
    name: "Moving Up",
    multiplier: 5,
    index: RankingLevelIndex.MovingUp,
  },
  {
    name: "Good",
    multiplier: 8,
    index: RankingLevelIndex.Good,
  },
  {
    name: "Solid",
    multiplier: 15,
    index: RankingLevelIndex.Solid,
  },
  {
    name: "Nice",
    multiplier: 25,
    index: RankingLevelIndex.Nice,
  },
  {
    name: "Great",
    multiplier: 40,
    index: RankingLevelIndex.Great,
  },
  {
    name: "Amazing",
    multiplier: 50,
    index: RankingLevelIndex.Amazing,
  },
  {
    name: "Genius",
    multiplier: 70,
    index: RankingLevelIndex.Genius,
  },
];
