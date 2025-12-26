import GameIndex from "../components";
import { createFileRoute } from "@tanstack/react-router";
import { getSessionOrRedirect } from "@/serverFns";

export const Route = createFileRoute("/game/$gameId")({
  beforeLoad: async () => {
    await getSessionOrRedirect();
  },
  component: Game,
});

function Game() {
  return <GameIndex />;
}
