import GameIndex from "../components";
import { GameContext } from "../hooks/useGame";
import { createFileRoute } from "@tanstack/react-router";
import { getGameState } from "../gameState.ts";

export const Route = createFileRoute("/")({
  loader: () => getGameState({ data: {} }),
  component: Home,
});

function Home() {
  const gameState = Route.useLoaderData();
  console.log({ gameState });

  return (
    <GameContext.Provider value={gameState}>
      <GameIndex />
    </GameContext.Provider>
  );
}
