import { PrismaClient } from '@prisma/client';
import { LettersSchema, AnswersSchema, WordsSchema } from '../schemas/database';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function getLatestGame() {
  return prisma.game.findFirst({
    orderBy: { date: 'desc' },
  });
}

export async function createGame(gameData: {
  answers: unknown;
  centerLetter: string;
  letters: unknown;
  date: string;
}) {
  // Validate input data with Zod
  const validatedAnswers = AnswersSchema.parse(gameData.answers);
  const validatedLetters = LettersSchema.parse(gameData.letters);

  return prisma.game.create({
    data: {
      answers: validatedAnswers,
      centerLetter: gameData.centerLetter,
      letters: validatedLetters,
      date: gameData.date,
    },
  });
}

export async function getSession({
  gameId,
  userId,
}: {
  gameId: string;
  userId: string;
}) {
  return prisma.session.findUnique({
    where: { userId_gameId: { userId, gameId } },
  });
}

export async function upsertSession({
  userId,
  gameId,
  words,
}: {
  userId: string;
  gameId: string;
  words: unknown;
}) {
  // Validate words array with Zod
  const validatedWords = WordsSchema.parse(words);

  // Use findFirst to locate existing session, then create or update
  const existingSession = await prisma.session.findFirst({
    where: {
      userId,
      gameId,
    },
  });

  if (existingSession) {
    return prisma.session.update({
      where: { id: existingSession.id },
      data: { words: validatedWords },
    });
  } else {
    return prisma.session.create({
      data: {
        userId,
        gameId,
        words: validatedWords,
      },
    });
  }
}

export async function findUserByUsername(username: string) {
  return prisma.user.findFirst({
    where: { username },
  });
}

export async function createUser(username: string) {
  return prisma.user.create({
    data: { username },
  });
}
