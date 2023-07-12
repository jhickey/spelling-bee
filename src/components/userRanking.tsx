import useStore from '../useStore';
import { rankingLevels } from '../constants';

interface UserRankingProps {
  answers: string[];
  userPoints: number;
  onClickRankingName: () => void;
}

export default function UserRanking(props: UserRankingProps) {
  const { userPoints, onClickRankingName } = props;
  const { getRankingLevel } = useStore();
  const userRankingLevel = getRankingLevel();
  return (
    <div className="flex flex-row w-full items-center justify-center">
      <h3
        onClick={onClickRankingName}
        className="flex items-center justify-center p-1  w-32 font-semibold"
      >
        {getRankingLevel().name}
      </h3>
      <div className="w-full">
        <div className="ranking-bar">
          {rankingLevels.map((rankingLevel, index) => (
            <div key={rankingLevel.name}>
              {userRankingLevel.name === rankingLevel.name ? (
                <div className="current-rank-icon bounce">
                  <p className="font-thin text-sm ">{userPoints}</p>
                </div>
              ) : userRankingLevel.multiplier > rankingLevel.multiplier ? (
                <div className="past-rank-icon"></div>
              ) : rankingLevel.name ===
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
