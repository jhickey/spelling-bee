import { AiOutlineClose } from 'react-icons/ai';
import MenuPage from './menuPage';
import HintsGrid from '../../utils/HintsGrid';
import useStore from '../../useStore';
import { useEffect, useState } from 'react';
import HintsTable from './HintsTable';
import HintsStartingLetters from './HintsStartingLetters';

interface HintsProps {
  setShowMenuItem: (arg: string | null) => void;
  answers: string[];
  pangrams: string[];
  setRevealAnswers: () => void;
  revealAnswers: boolean;
}

export default function Hints(props: HintsProps) {
  const { setShowMenuItem } = props;
  const { answers, foundWords, validLetters, pangrams } = useStore();
  const [hints, setHints] = useState(null);

  useEffect(() => {
    const hintsGrid = new HintsGrid({
      answers,
      foundWords: foundWords.map((w) => w.toLowerCase()),
      validLetters,
    });
    console.log(hintsGrid.getData());
    setHints(hintsGrid.getData());
  }, [foundWords.length]);

  return (
    <MenuPage>
      <div className="flex flex-row w-full justify-between items-center">
        <h1 className="text-2xl font-bold">Hints</h1>
        <button className="menu-icon" onClick={() => setShowMenuItem(null)}>
          <AiOutlineClose />
        </button>
      </div>
      <div className="p-2">
        <p className="text-lg font-thin">
          {foundWords.length}/{answers.length} words
        </p>
        <p className="text-lg font-thin">
          {hints?.pangramCounts[2]}/{pangrams.length} pangrams (
          {hints?.pangramCounts[1]} perfect)
        </p>
      </div>
      {hints && <HintsTable data={hints} />}
      {hints && (
        <HintsStartingLetters startingLetters={hints.startingLetters} />
      )}
    </MenuPage>
  );
}
