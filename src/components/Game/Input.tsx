import { useEffect, useState } from 'react';

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

  const keyDown = (e): void => {
    const { keyCode, key } = e;
    if (keyCode === 91) {
      setModifierDown(true);
      return;
    }
    if (modifierDown) {
      return;
    }
    if (e.keyCode === 8) {
      backSpace();
    } else if (keyCode > 64 && keyCode < 91) {
      setUserWord(userWord.concat(key.toUpperCase()));
    } else if (keyCode === 13) {
      searchWord(userWord);
    } else if (keyCode === 32) {
      shuffle();
    }
  };

  const keyUp = (e) => {
    const { keyCode } = e;

    if (keyCode === 91) {
      setModifierDown(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
    };
  }, [keyDown]);

  return (
    <div data-testid="input-div" className={hasError ? 'has-error' : ''}>
      <h2 className="input self-center ">
        {userWord.split('').map((letter, i) => (
          <span
            key={i}
            className={
              letter === centerLetter.toUpperCase()
                ? 'text-yellow-500'
                : outerLetters.includes(letter.toUpperCase())
                ? 'text-black'
                : 'text-gray-300'
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
