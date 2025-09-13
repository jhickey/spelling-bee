import { NextApiRequest, NextApiResponse } from 'next';
import { getSession, upsertSession } from '../../src/utils/database';
import { use } from 'next-api-route-middleware';
import { authApi } from '../../src/utils/auth';
import { WordsSchema } from '../../src/schemas/database';
import { z } from 'zod';

async function getSessionHandler(req: NextApiRequest, res: NextApiResponse) {
  const userId = 'cmfhi7id00002bnk1b4l0tyig';
  const { gameId } = z.object({ gameId: z.string() }).parse(req.query);
  try {
    const row = await getSession({ userId, gameId });
    res.send({
      words: row ? WordsSchema.parse(row.words) : [],
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred' });
  }
}

async function postSessionHandler(req: NextApiRequest, res: NextApiResponse) {
  const userId = 'cmfhi7id00002bnk1b4l0tyig';
  const { words, gameId } = req.body;
  try {
    // Validate words array using Zod
    const validatedWords = WordsSchema.parse(words);

    await upsertSession({
      userId,
      gameId: gameId as string,
      words: validatedWords,
    });
    res.send({
      words: validatedWords,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred' });
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      await postSessionHandler(req, res);
      break;
    case 'GET':
      await getSessionHandler(req, res);
      break;
    default:
      res.status(405).end();
      break;
  }
}

export default use(authApi, handler);
