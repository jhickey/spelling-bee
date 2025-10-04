import { useEffect, useState } from "react";

interface InputProps {
  userWord: string;
  setUserWord: (arg: string) => void;
  backSpace: () => void;
  searchWord: (word: string) => void;
  shuffle: () => void;
  outerLetters: string[];
  centerLetter: string;
  hasError: boolean;
}

export default function Input(props: InputProps) {
  const {
    userWord,
    setUserWord,
    backSpace,
    searchWord,
    shuffle,
    centerLetter,
    outerLetters,
    hasError,
  } = props;

  const [modifierDown, setModifierDown] = useState(false);

  const keyDown = (e: KeyboardEvent): void => {
    const { code, key } = e;
    if (key === "Meta") {
      setModifierDown(true);
      return;
    }
    if (modifierDown) {
      return;
    }
    if (key === "Backspace" || key === "Delete") {
      backSpace();
    } else if (code === `Key${key.toUpperCase()}`) {
      setUserWord(userWord.concat(key.toUpperCase()));
    } else if (code === "Enter") {
      searchWord(userWord);
    } else if (code === "Space") {
      e.preventDefault();
      shuffle();
    }
  };

  const keyUp = (e: KeyboardEvent) => {
    const { key } = e;

    if (key === "Meta") {
      setModifierDown(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, [keyDown]);

  return (
    <div data-testid="input-div" className={hasError ? "has-error" : ""}>
      <h2 className="input self-center ">
        {userWord.split("").map((letter, i) => (
          <span
            key={i}
            className={
              letter === centerLetter.toUpperCase()
                ? "text-yellow-500"
                : outerLetters.includes(letter.toUpperCase())
                  ? "text-black"
                  : "text-gray-300"
            }
          >
            {letter}
          </span>
        ))}
        <span className="cursor">|</span>
      </h2>
    </div>
  );
}
