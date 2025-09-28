import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../src/utils/database';
import { authApi } from '../../src/utils/auth';
import { use } from 'next-api-route-middleware';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const games = await prisma.game.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    res.status(200).json(games);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
}

export default use(authApi, handler);
