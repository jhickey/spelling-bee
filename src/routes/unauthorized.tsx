import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/unauthorized")({
  component: Unauthorized,
});

function Unauthorized() {
  return <div>Unauthorized</div>;
}
