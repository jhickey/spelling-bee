import { createGame } from "@/utils/database";
import logger from "../../utils/logger";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/game")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const response = await fetch(
            "https://www.nytimes.com/puzzles/spelling-bee",
          );
          const text = await response.text();
          const startIndex = text.indexOf("gameData") + 11;
          const endIndex = text.indexOf("}}", text.indexOf("gameData")) + 2;
          const data = JSON.parse(text.slice(startIndex, endIndex));
          const proms = [
            data.today,
            data.yesterday,
            ...data.pastPuzzles.thisWeek,
            ...data.pastPuzzles.lastWeek,
          ].map(async (day) => {
            const { answers, validLetters, centerLetter, printDate, id } = day;
            await createGame({
              answers,
              centerLetter,
              letters: validLetters,
              date: printDate,
              nytId: id,
            });
          });
          await Promise.all(proms);

          return new Response(JSON.stringify({ status: "success" }));
        } catch (error) {
          logger.error(error as Error);
          return new Response(JSON.stringify({ error: "An error occurred" }));
        }
      },
    },
  },
});
