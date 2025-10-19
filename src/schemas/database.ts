import { z } from "zod";

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
    printDate: z.string(),
    letters: z.array(z.string().length(1)).length(7),
    centerLetter: z.string().length(1),
    answers: z.array(WordSchema),
  })
  .extend(DefaultsSchema);

export const LettersSchema = z.array(z.string()).length(7);

export const AnswersSchema = z.array(z.string());

export const SettingsSchema = z.preprocess(
  (val) => {
    if (typeof val === "object" && val !== null) {
      return val;
    }
    return {};
  },
  z.object({
    showStartingLetterHints: z.number().default(7),
    showRemainingLetterHints: z.number().default(8),
    showLetterDepleted: z.boolean().default(true),
  }),
);

export type UserSettings = z.infer<typeof SettingsSchema>;
