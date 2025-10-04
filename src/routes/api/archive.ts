import { prisma } from "@/utils/database.ts";
import { createFileRoute } from "@tanstack/react-router";
import logger from "@/utils/logger.ts";
import { json } from "@tanstack/react-start";
import authMiddleware from "@/middleware/authMiddleware.ts";

export const Route = createFileRoute("/api/archive")({
  server: {
    middleware: [authMiddleware],
    handlers: {
      GET: async () => {
        try {
          const games = await prisma.game.findMany({
            orderBy: {
              date: "desc",
            },
          });
          return json(games);
        } catch (error) {
          logger.error(error as Error);
          return json(
            { error: "An error occurred" },
            {
              status: 500,
            },
          );
        }
      },
    },
  },
});
