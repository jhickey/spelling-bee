import { getSession, upsertGameSession } from "@/utils/database.ts";
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import authMiddleware from "@/middleware/authMiddleware.ts";
import z from "zod";
import { WordSchema } from "@/schemas/database.ts";
import validationMiddleware from "@/middleware/validationMiddleware.ts";

const PostSessionBodySchema = z.object({
  words: WordSchema.array(),
});

export const Route = createFileRoute("/api/session/$gameId")({
  server: {
    middleware: [authMiddleware],
    handlers: ({ createHandlers }) =>
      createHandlers({
        GET: {
          handler: async ({ context, params: { gameId } }) => {
            try {
              const { words } = await getSession({
                userId: context.userId,
                gameId,
              });
              json(words);
            } catch (e) {
              console.error(e);
              return json(
                { error: "An error occurred" },
                {
                  status: 500,
                },
              );
            }
          },
        },
        POST: {
          middleware: [validationMiddleware(PostSessionBodySchema)],
          handler: async ({ context, params: { gameId } }) => {
            try {
              const { words } = context.data;
              await upsertGameSession({
                userId: context.userId,
                gameId,
                words,
              });
              const newSession = await getSession({
                userId: context.userId,
                gameId,
              });
              json(newSession);
            } catch (e) {
              console.error(e);
              return json(
                { error: "An error occurred" },
                {
                  status: 500,
                },
              );
            }
          },
        },
      }),
  },
});
