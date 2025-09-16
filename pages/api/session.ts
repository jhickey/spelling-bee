import { NextApiResponse } from 'next';
import { getSession, upsertGameSession } from '../../src/utils/database';
import { use } from 'next-api-route-middleware';
import { authApi } from '../../src/utils/auth';
import { WordsSchema } from '../../src/schemas/database';
import { z } from 'zod';
import { NextApiRequestWithUser } from '../../src/types';

async function getSessionHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  const { gameId } = z.object({ gameId: z.string() }).parse(req.query);
  try {
    const row = await getSession({ userId: req.userId, gameId });
    res.send({
      words: row ? WordsSchema.parse(row.words) : [],
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred' });
  }
}

async function postSessionHandler(
  req: NextApiRequestWithUser,
  res: NextApiResponse
) {
  const { words, gameId } = req.body;
  try {
    // Validate words array using Zod
    const validatedWords = WordsSchema.parse(words);

    await upsertGameSession({
      userId: req.userId,
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

async function handler(req: NextApiRequestWithUser, res: NextApiResponse) {
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
