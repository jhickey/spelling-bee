import { createMiddleware } from "@tanstack/react-start";

const authMiddleware = createMiddleware().server(async ({ next }) => {
  return next({
    context: {
      userId: "cmflti6qc0003bnxs11nhpge0",
    },
  });
});

export default authMiddleware;
