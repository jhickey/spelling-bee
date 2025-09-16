import NextAuth, { Session } from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../src/utils/database';
import AuthentikProvider from 'next-auth/providers/authentik';
import { z } from 'zod';

export const authOptions: NextAuthOptions = {
  providers: [
    AuthentikProvider({
      clientId: process.env.AUTH_AUTHENTIK_ID || '',
      clientSecret: process.env.AUTH_AUTHENTIK_SECRET || '',
      issuer: process.env.AUTH_AUTHENTIK_ISSUER || '',
      authorization: { params: { scope: 'openid profile email groups' } },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      } as Session & { user: { id: string } };
    },
    async signIn({ user, profile }) {
      const { groups } = z
        .object({ groups: z.array(z.string()) })
        .parse(profile);
      const hasRequiredGroup = groups.includes('spelling-bee');

      if (!hasRequiredGroup) {
        console.warn('User not in required group:', user.email, groups);
        return false;
      }

      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
