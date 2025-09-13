import { z } from 'zod';

// Schema for the letters array in games
export const LettersSchema = z.array(z.string()).length(7);

// Schema for the answers array in games
export const AnswersSchema = z.array(z.string());

// Schema for the words array in sessions
export const WordsSchema = z.array(z.string());
