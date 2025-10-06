import { capitalize } from "./index";
import useGame from "@/hooks/useGame.ts";

export default function FullList() {
  const {
    session,
    gameState: { pangrams },
  } = useGame();
  return (
    <div className="w-full" data-testid="full-list-div">
      <div className="w-full flex flex-col flex-wrap ">
        {session?.words.length &&
          [...session.words].sort().map((i) => (
            <p
              key={i.id}
              className={
                pangrams.find((w) => w.value === i.value.toLowerCase())
                  ? "px-1 border-b border-b-gray-300 py-2 font-semibold"
                  : "px-1 border-b border-b-gray-300 py-2"
              }
            >
              {capitalize(i.value)}
            </p>
          ))}
      </div>
    </div>
  );
}
