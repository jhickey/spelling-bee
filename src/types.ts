export interface RankingLevel {
  name: string;
  multiplier: number;
  index: number;
}

export interface GameSessionRow {
  id: string;
  userId: string;
  gameId: string;
  words: string[];
}

export interface GameDataRow {
  letters: string[];
  centerLetter: string;
  date: string;
  answers: string[];
  id: string;
}
