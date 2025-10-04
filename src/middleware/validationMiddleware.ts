import z, { ZodTypeAny } from "zod";
import { createMiddleware } from "@tanstack/react-start";

export default function validationMiddleware<T extends ZodTypeAny>(
  validator: T,
) {
  return createMiddleware().server(async ({ next, request }) => {
    const body = await request.json();
    const data: z.infer<typeof validator> = validator.parse(body);
    return next({
      context: {
        data,
      },
    });
  });
}
