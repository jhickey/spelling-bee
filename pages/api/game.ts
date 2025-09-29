import type { NextApiRequest, NextApiResponse } from 'next';
import { createGame } from '../../src/utils/database';
import { authApi } from '../../src/utils/auth';
import { use } from 'next-api-route-middleware';
import logger from '../../src/utils/logger';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(
      'https://www.nytimes.com/puzzles/spelling-bee'
    );
    const text = await response.text();
    const startIndex = text.indexOf('gameData') + 11;
    const endIndex = text.indexOf('}}', text.indexOf('gameData')) + 2;
    const data = JSON.parse(text.slice(startIndex, endIndex));
    const proms = [
      data.today,
      data.yesterday,
      ...data.pastPuzzles.thisWeek,
      ...data.pastPuzzles.lastWeek,
    ].map(async (day) => {
      const { answers, validLetters, centerLetter, printDate, id } = day;

      await createGame({
        answers,
        centerLetter,
        letters: validLetters,
        date: printDate,
        nytId: id,
      });
    });
    await Promise.all(proms);

    res.status(200).json({ status: 'success' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

export default use(authApi, handler);
