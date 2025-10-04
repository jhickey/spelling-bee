import Hexagon from "./Hexagon";

interface LettersProps {
  setLetter: (arg: string) => void;
  isShuffling?: boolean;
  centerLetter: string;
  outerLetters: string[];
  letterIndex: number[];
}

export default function Letters(props: LettersProps) {
  const { setLetter, centerLetter, outerLetters, letterIndex, isShuffling } =
    props;
  return (
    <div data-testid="letters-div" className="hive">
      <Hexagon
        center={true}
        letter={centerLetter}
        setLetter={() => setLetter(centerLetter)}
      />
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <Hexagon
            key={outerLetters[letterIndex[i]]}
            center={false}
            letter={outerLetters[letterIndex[i]]}
            setLetter={() => setLetter(outerLetters[letterIndex[i]])}
            isShuffling={isShuffling}
          />
        ))}
    </div>
  );
}
