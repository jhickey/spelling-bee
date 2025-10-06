import { Game, PrismaClient, Word } from "@prisma/client";
import { AnswersSchema, GameSchema, LettersSchema } from "../schemas/database";
import { getWordsApiClient } from "../clients/WordsApiClient";
import logger from "./logger";
import { TransportError } from "../clients/ApiClient";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getGame(gameId: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { answers: true },
  });
  return game ? GameSchema.parse(game) : null;
}

export async function getLatestGame() {
  const game = await prisma.game.findFirst({
    orderBy: { date: "desc" },
    include: { answers: true },
  });
  return GameSchema.parse(game);
}

export async function createGame(gameData: {
  answers: unknown;
  centerLetter: string;
  letters: unknown;
  date: string;
  nytId: number;
}): Promise<Game> {
  const validatedAnswers = AnswersSchema.parse(gameData.answers);
  const validatedLetters = LettersSchema.parse(gameData.letters);

  const wordsApiClient = getWordsApiClient();
  const answerProms = validatedAnswers.map(async (answer) => {
    const existingWord = await prisma.word.findUnique({
      where: { value: answer },
    });
    if (existingWord) {
      return existingWord;
    }
    try {
      const { frequency } = await wordsApiClient.getFrequency(answer);
      return prisma.word.create({
        data: {
          value: answer,
          isValid: true,
          isBonus: false,
          frequencyZipf: frequency?.zipf ?? null,
          frequencyPerMillion: frequency?.perMillion ?? null,
        },
      });
    } catch (e) {
      if (e instanceof TransportError) {
        if (e.statusCode === 404) {
          logger.warn(`Word not found in WordsAPI: "${answer}"`);
        } else {
          logger.error(
            `Error looking up word frequency for "${answer}": ${e.message}`,
          );
        }
      }
      return prisma.word.create({
        data: {
          value: answer,
          isValid: true,
          isBonus: false,
          frequencyZipf: null,
          frequencyPerMillion: null,
        },
      });
    }
  });
  const answers = await Promise.all(answerProms);

  return prisma.game.upsert({
    where: { nytId: gameData.nytId },
    create: {
      answers: {
        connect: answers.map((a) => ({ id: a.id })),
      },
      centerLetter: gameData.centerLetter,
      letters: validatedLetters,
      date: new Date(gameData.date),
      nytId: gameData.nytId,
    },
    update: {
      answers: {
        set: answers.map((a) => ({ id: a.id })),
      },
      centerLetter: gameData.centerLetter,
      letters: validatedLetters,
      date: new Date(gameData.date),
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
  const session = await prisma.gameSession.findUnique({
    where: { userId_gameId: { userId, gameId } },
    include: {
      words: true,
    },
  });

  return (
    session ||
    prisma.gameSession.create({
      data: {
        userId,
        gameId,
      },
      include: {
        words: true,
      },
    })
  );
}

export async function upsertGameSession({
  userId,
  gameId,
  words,
}: {
  userId: string;
  gameId: string;
  words: Word[];
}) {
  // Validate words array with Zod

  // Use findFirst to locate existing session, then create or update
  const existingSession = await prisma.gameSession.findFirst({
    where: {
      userId,
      gameId,
    },
  });

  if (existingSession) {
    return prisma.gameSession.update({
      where: { id: existingSession.id },
      data: { words: { set: words.map((word) => ({ id: word.id })) } },
    });
  } else {
    return prisma.gameSession.create({
      data: {
        userId,
        gameId,
        words: { connect: words.map((word) => ({ id: word.id })) },
      },
    });
  }
}
