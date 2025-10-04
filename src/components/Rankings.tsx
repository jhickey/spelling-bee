import { rankingLevels } from "../constants";
import { calculateRankingPoints } from "../utils/game";
import useGame from "../hooks/useGame";

export default function Rankings() {
  const {
    gameState: { totalPoints },
  } = useGame();

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h2 className="font-bold text-2xl">Rankings</h2>
      </div>
      <ul className="pl-4 font-semithin">
        {rankingLevels.map((rankingLevel) => (
          <li key={rankingLevel.name}>
            {rankingLevel.name} (
            <span className="font-medium">
              {calculateRankingPoints(rankingLevel.multiplier, totalPoints)}
            </span>
            )
          </li>
        ))}
      </ul>
    </div>
  );
}
