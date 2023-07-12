import { NextResponse } from 'next/server';
import logger from './logger';
import { dbGetOne, dbRun, getDatabase } from './database';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiRequestWithUser } from '../types';
import { IncomingMessage } from 'http';

export const SECURITY_GROUP = 'ermap';

async function getOrCreateUser(userName: string) {
  const db = await getDatabase();
  const user = await dbGetOne<{ id: number }>(
    db,
    'SELECT id FROM users WHERE username = ?',
    [userName]
  );
  if (user) {
    return user.id;
  }
  const newUserId = await dbRun(db, 'INSERT INTO users (username) VALUES (?)', [
    userName,
  ]);
  logger.info(`created new user`, newUserId);
  // cache.set(`user_${userName}`, newUserId);
  return newUserId;
}
export async function authPage(req: IncomingMessage) {
  return await auth(req);
}
export async function authApi(
  req: NextApiRequestWithUser,
  res: NextApiResponse,
  next: () => Promise<void>
) {
  const userId = await auth(req);
  if (!userId) {
    return res.status(401).send({ error: 'unauthorized' });
  }
  req.userId = userId;
  await next();
}

async function auth(req: NextApiRequestWithUser | IncomingMessage) {
  const { 'remote-groups': remoteGroups, 'remote-user': remoteUser } =
    req.headers;
  if (!remoteUser || !remoteGroups) {
    logger.warn('missing auth headers');
    return null;
  }
  const groups = (remoteGroups as string).split(',');
  if (!groups.includes(SECURITY_GROUP)) {
    logger.warn('user not in security group', remoteUser, remoteGroups);
    return null;
  }
  return await getOrCreateUser(remoteUser as string);
}
