import { NextApiRequest } from 'next';

export interface RankingLevel {
  name: string;
  multiplier: number;
}

export interface GameSessionRow {
  id: string;
  userId: string;
  gameId: string;
  words: string;
}

export interface GameDataRow {
  letters: string;
  center_letter: string;
  date: string;
  answers: string;
  id: string;
}

export type NextApiRequestWithUser = NextApiRequest & { userId: number };
