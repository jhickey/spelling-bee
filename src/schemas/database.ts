import { z } from 'zod';

const DefaultsSchema = {
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
};

export const WordSchema = z
  .object({
    id: z.number(),
    value: z.string().min(4),
    frequencyZipf: z.number().nullable(),
    frequencyPerMillion: z.number().nullable(),
    isValid: z.boolean().default(true),
    isBonus: z.boolean().default(false),
  })
  .extend(DefaultsSchema);

export type ZWord = z.infer<typeof WordSchema>;

export const GameSchema = z
  .object({
    id: z.string(),
    date: z.date(),
    letters: z.array(z.string().length(1)).length(7),
    centerLetter: z.string().length(1),
    answers: z.array(WordSchema),
  })
  .extend(DefaultsSchema);

export type ZGame = z.infer<typeof GameSchema>;

export const GameSessionSchema = z
  .object({
    id: z.string(),
    userId: z.string(),
    words: z.array(WordSchema),
  })
  .extend(DefaultsSchema);

export type ZGameSession = z.infer<typeof GameSessionSchema>;

// Schema for the letters array in games
export const LettersSchema = z.array(z.string()).length(7);

// Schema for the answers array in games
export const AnswersSchema = z.array(z.string());
