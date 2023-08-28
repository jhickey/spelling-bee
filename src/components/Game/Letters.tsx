import { useState } from 'react';
import Hexagon from './Hexagon';

interface LettersProps {
  setLetter: (arg: string) => void;
  isShuffling?: boolean;
  centerLetter: string | undefined;
  outerLetters: string[];
  letterIndex: number[];
}

export default function Letters(props: LettersProps) {
  const {
    setLetter,
    centerLetter = undefined,
    outerLetters = [],
    letterIndex,
    isShuffling,
  } = props;

  return (
    <div data-testid="letters-div" className="hive">
      <Hexagon
        center={true}
        letter={centerLetter}
        setLetter={() => setLetter(centerLetter)}
      />
      <Hexagon
        center={false}
        letter={outerLetters[letterIndex[0]]}
        setLetter={() => setLetter(outerLetters[letterIndex[0]])}
        isShuffling={isShuffling}
      />
      <Hexagon
        center={false}
        letter={outerLetters[letterIndex[1]]}
        setLetter={() => setLetter(outerLetters[letterIndex[1]])}
        isShuffling={isShuffling}
      />
      <Hexagon
        center={false}
        letter={outerLetters[letterIndex[2]]}
        setLetter={() => setLetter(outerLetters[letterIndex[2]])}
        isShuffling={isShuffling}
      />
      <Hexagon
        center={false}
        letter={outerLetters[letterIndex[3]]}
        setLetter={() => setLetter(outerLetters[letterIndex[3]])}
        isShuffling={isShuffling}
      />
      <Hexagon
        center={false}
        letter={outerLetters[letterIndex[4]]}
        setLetter={() => setLetter(outerLetters[letterIndex[4]])}
        isShuffling={isShuffling}
      />
      <Hexagon
        center={false}
        letter={outerLetters[letterIndex[5]]}
        setLetter={() => setLetter(outerLetters[letterIndex[5]])}
        isShuffling={isShuffling}
      />
    </div>
  );
}
