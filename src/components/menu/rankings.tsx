import { AiOutlineClose } from 'react-icons/ai';
import MenuPage from './menuPage';
import useStore from '../../useStore';
import { rankingLevels } from '../../constants';
import { calculateRankingPoints } from '../../utils/game';
interface RankingsProps {
  answers: string[];
  setShowMenuItem: (arg: null) => void;
}

export default function Rankings(props: RankingsProps) {
  const { setShowMenuItem } = props;
  const { getPoints } = useStore();

  return (
    <MenuPage>
      <div className="flex flex-row justify-between">
        <h2 className="font-bold text-2xl">Rankings</h2>
        <button className="menu-icon" onClick={() => setShowMenuItem(null)}>
          <AiOutlineClose />
        </button>
      </div>
      <ul className="pl-4 font-semithin">
        {rankingLevels.map((rankingLevel) => (
          <li key={rankingLevel.name}>
            {rankingLevel.name} (
            <span className="font-medium">
              {calculateRankingPoints(rankingLevel.multiplier, getPoints())}
            </span>
            )
          </li>
        ))}
      </ul>
    </MenuPage>
  );
}
