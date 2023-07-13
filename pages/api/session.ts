import { NextApiRequest, NextApiResponse } from 'next';
import { dbGetOne, dbRun, getDatabase } from '../../src/utils/database';
import { GameSessionRow } from '../../src/types';
import { use } from 'next-api-route-middleware';
import { authApi } from '../../src/utils/auth';
async function getSessionHandler(req: NextApiRequest, res: NextApiResponse) {
  // const userId: string = res.locals.user;
  const userId = '1';
  const { gameId } = req.query;
  const id = `${gameId}_${userId}`;
  try {
    const db = await getDatabase();
    const row = await dbGetOne<GameSessionRow>(
      db,
      'SELECT * FROM sessions WHERE id = ?',
      [id]
    );
    res.send({
      id,
      words: row ? JSON.parse(row.words) : [],
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred' });
  }
}

function getNYTRequest(
  gameId: string,
  answers: string[],
  userId: string,
  puzzleId: number
) {
  const timestamp = Math.round(Date.now() / 1000);

  return {
    game: 'spelling_bee',
    game_data: {
      answers,
      isRevealed: false,
    },
    puzzle_id: puzzleId,
    schema_version: '0.2.5',
    timestamp,
    user_id: userId,
  };
}
async function postSessionHandler(req: NextApiRequest, res: NextApiResponse) {
  // const userId: string = res.locals.user;
  const userId = '1';
  const { words, gameId } = req.body;
  const id = `${gameId}_${userId}`;
  try {
    const db = await getDatabase();
    await dbRun(
      db,
      'INSERT OR REPLACE INTO sessions (id, userId, gameId, words) VALUES (?, ?, ?, ?)',
      [id, userId, gameId, JSON.stringify(words)]
    );
    res.send({
      id,
      words,
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
