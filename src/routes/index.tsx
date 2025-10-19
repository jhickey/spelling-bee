import GameIndex from "../components";
import { createFileRoute } from "@tanstack/react-router";
import { getSessionOrRedirect } from "@/serverFns.ts";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    await getSessionOrRedirect();
  },
  component: Home,
});

function Home() {
  return <GameIndex />;
}
