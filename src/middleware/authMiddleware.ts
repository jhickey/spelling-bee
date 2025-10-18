import { createMiddleware } from "@tanstack/react-start";
import { auth } from "@/utils/auth";
import { getRequestHeaders } from "@tanstack/start-server-core";
import { redirect } from "@tanstack/router-core";

const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
  });
  if (!session) {
    throw redirect({ to: "/auth/signin" });
  }
  return next({
    context: {
      session,
    },
  });
});

export default authMiddleware;
