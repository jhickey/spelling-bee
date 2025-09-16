import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../pages/api/auth/[...nextauth]';
import { GetServerSidePropsContext, NextApiResponse } from 'next';
import { NextApiRequestWithUser } from '../types';
import { Session } from 'next-auth';

export async function authPage(context: GetServerSidePropsContext) {
  const session: Session & { user: { id: string } } = await getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session?.user?.id) {
    return null;
  }
  return session.user.id;
}

export async function authApi(
  req: NextApiRequestWithUser,
  res: NextApiResponse,
  next: () => Promise<void>
) {
  const session: Session & { user: { id: string } } = await getServerSession(
    req,
    res,
    authOptions
  );
  if (!session?.user?.id) {
    return res.status(401).send({ error: 'unauthorized' });
  }
  req.userId = session.user.id;
  await next();
}
