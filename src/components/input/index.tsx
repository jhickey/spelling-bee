import { useEffect, useState } from 'react';
import Buttons from './Buttons';
import Input from './Input';
import Letters from './Letters';

interface InputIndexProps {
  centerLetter: string;
  outerLetters: string[];
  enterWord: (word: string) => void;
  inputWord: string;
  setInputWord: (str: string) => void;
  message: string | null;
  hasError: boolean;
}

export default function InputIndex(props: InputIndexProps) {
  const {
    message,
    centerLetter,
    outerLetters,
    enterWord,
    setInputWord,
    inputWord,
    hasError,
  } = props;
  const [zeroToFive, setZeroToFive] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const shuffle = (): void => {
    setIsShuffling(true);
    setTimeout(() => {
      setZeroToFive([...zeroToFive].sort(() => Math.random() - 0.5));
    }, 200);
    setTimeout(() => {
      setIsShuffling(false);
    }, 400);
  };

  const backSpace = (): void => {
    setInputWord(inputWord.slice(0, -1));
  };

  return (
    <div className="mt-16 flex flex-col items-center md:w-1/2 input-container">
      {message && (
        <div className="absolute -mt-10 z-30 bg-black text-white px-3 py-1 rounded font-light text-sm">
          <h3>{message}</h3>
        </div>
      )}
      <Input
        hasError={hasError}
        outerLetters={outerLetters}
        centerLetter={centerLetter}
        shuffle={() => shuffle()}
        backSpace={() => backSpace()}
        searchWord={(word) => enterWord(word)}
        userWord={inputWord}
        setUserWord={(str) => setInputWord(str)}
      />
      <Letters
        letterIndex={zeroToFive}
        centerLetter={centerLetter}
        setLetter={(letter) => setInputWord(inputWord + letter)}
        outerLetters={outerLetters}
        isShuffling={isShuffling}
      />
      <Buttons
        shuffle={() => shuffle()}
        clearWord={() => backSpace()}
        searchWord={() => enterWord(inputWord)}
      />
    </div>
  );
}
