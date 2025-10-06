import { useMemo, useState } from "react";
import Buttons from "./Buttons";
import Input from "./Input";
import Letters from "./Letters";
import useGame from "../../hooks/useGame";

interface InputIndexProps {
  inputWord: string;
  handleInput: (word: string) => void;
  handleSubmit: (word: string) => void;
  error: boolean;
  message: string;
}

export default function InputIndex({
  inputWord,
  handleInput,
  handleSubmit,
  message,
  error,
}: InputIndexProps) {
  const { game } = useGame();

  if (!game) {
    return null;
  }

  const [zeroToFive, setZeroToFive] = useState<number[]>([0, 1, 2, 3, 4, 5]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);

  const outerLetters = useMemo(() => {
    return game.letters
      .filter((letter) => letter !== game.centerLetter)
      .map((letter) => letter.toUpperCase());
  }, [game.letters]);

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
    handleInput(inputWord.slice(0, -1));
  };

  return (
    <div className="mt-9 mx-auto px-3 max-w-sm flex-col items-center md:w-1/2">
      {message && (
        <div className="absolute -mt-10 z-30 bg-black text-white px-3 py-1 rounded font-light text-sm">
          <h3>{message}</h3>
        </div>
      )}
      <Input
        hasError={error}
        outerLetters={outerLetters}
        centerLetter={game.centerLetter}
        shuffle={shuffle}
        backSpace={backSpace}
        searchWord={handleSubmit}
        userWord={inputWord}
        setUserWord={handleInput}
      />
      <Letters
        letterIndex={zeroToFive}
        centerLetter={game.centerLetter}
        setLetter={(letter) => handleInput(inputWord.concat(letter))}
        outerLetters={outerLetters}
        isShuffling={isShuffling}
      />
      <Buttons
        shuffle={shuffle}
        clearWord={backSpace}
        searchWord={() => handleSubmit(inputWord)}
      />
    </div>
  );
}
