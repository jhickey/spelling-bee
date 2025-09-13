import type { NextApiRequest, NextApiResponse } from 'next';
import { createGame } from '../../src/utils/database';
import { authApi } from '../../src/utils/auth';
import { use } from 'next-api-route-middleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(
      'https://www.nytimes.com/puzzles/spelling-bee'
    );
    const text = await response.text();
    const startIndex = text.indexOf('gameData') + 11;
    const endIndex = text.indexOf('}}', text.indexOf('gameData')) + 2;
    const data = JSON.parse(text.slice(startIndex, endIndex));
    const {
      today: { answers, validLetters, centerLetter, printDate },
    } = data;

    await createGame({
      answers,
      centerLetter,
      letters: validLetters,
      date: printDate,
    });

    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

export default use(authApi, handler);
