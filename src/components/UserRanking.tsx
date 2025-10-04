import { rankingLevels } from "../constants";
import useGame from "../hooks/useGame";

interface UserRankingProps {
  onClickRankingName: () => void;
}

export default function UserRanking({ onClickRankingName }: UserRankingProps) {
  const {
    gameState: { userPoints, rankingLevel: userRankingLevel },
  } = useGame();
  return (
    <div className="flex flex-row w-full items-center justify-center">
      <h3
        onClick={onClickRankingName}
        className="flex items-center justify-center p-1  w-32 font-semibold"
      >
        {userRankingLevel.name}
      </h3>
      <div className="w-full">
        <div className="ranking-bar">
          {rankingLevels.map((rankingLevel) => (
            <div key={rankingLevel.name}>
              {rankingLevel.name === userRankingLevel.name ? (
                <div className="current-rank-icon bounce">
                  <p className="font-thin text-sm ">{userPoints}</p>
                </div>
              ) : userRankingLevel.multiplier > rankingLevel.multiplier ? (
                <div className="past-rank-icon"></div>
              ) : userRankingLevel.name ===
                rankingLevels[rankingLevels.length - 1].name ? (
                <div className="final-rank-icon"></div>
              ) : (
                <div className="future-rank-icon"></div>
              )}
            </div>
          ))}
        </div>
        <div className="line"></div>
      </div>
    </div>
  );
}
