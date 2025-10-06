import ApiClient from "./ApiClient";
import z from "zod";

const WordFrequencySchema = z.object({
  word: z.string(),
  frequency: z
    .object({
      zipf: z.number(),
      perMillion: z.number(),
      diversity: z.number(),
    })
    .optional(),
});

type WordFrequencyResponse = z.infer<typeof WordFrequencySchema>;

interface WordApiErrorResponse {
  message: string;
  success: boolean;
}

export class WordsApiClient extends ApiClient {
  constructor() {
    if (!process.env.WORDS_API_KEY) {
      throw new Error("Missing WORDS_API_KEY");
    }
    super({
      apiHost: "https://wordsapiv1.p.rapidapi.com",
      apiPath: "/words",
      headers: {
        "x-rapidapi-key": process.env.WORDS_API_KEY,
      },
    });
  }

  async getFrequency(word: string): Promise<WordFrequencyResponse> {
    const response = await this.get<
      WordFrequencyResponse,
      WordApiErrorResponse
    >(`/${word}/frequency`);
    return WordFrequencySchema.parse(response);
  }
}

let wordsApiClient: WordsApiClient | undefined = undefined;
export function getWordsApiClient(): WordsApiClient {
  if (!wordsApiClient) {
    wordsApiClient = new WordsApiClient();
  }
  return wordsApiClient;
}
