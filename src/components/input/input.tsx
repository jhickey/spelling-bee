import { useEffect } from 'react';

interface InputProps {
  userWord: string;
  setUserWord: (arg: string) => void;
  backSpace: () => void;
  revealedAnswers: boolean;
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
    revealedAnswers,
    searchWord,
    shuffle,
    centerLetter,
    outerLetters,
    hasError,
  } = props;

  const logKey = (e): void => {
    if (e.keyCode === 8) {
      backSpace();
    } else if (e.keyCode > 64 && e.keyCode < 91 && !hasError) {
      setUserWord(userWord.concat(e.key.toUpperCase()));
    } else if (e.keyCode === 13) {
      !revealedAnswers && searchWord(userWord);
    } else if (e.keyCode === 32) {
      shuffle();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', logKey);
    return () => {
      window.removeEventListener('keydown', logKey);
    };
  }, [logKey]);

  return (
    <div data-testid="input-div" className={hasError && 'has-error'}>
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
