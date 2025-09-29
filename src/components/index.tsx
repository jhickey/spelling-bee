import { useState } from 'react';
import Header from './Header';
import WordList from './WordList';
import UserRanking from './UserRanking';
import InputIndex from './Game';
import Hints from './Hints/Hints';
import Rankings from './Rankings';
import Realistic from './realistic';
import Encouragement from './Encouragement';
import useStore from '../useStore';
import Modal from './Modal';
import Calendar from './Calendar';

export default function GameIndex() {
  const {
    updateFoundWords,
    getPoints,
    foundWords,
    displayDate,
    answers,
    centerLetter,
    outerLetters,
    pangrams,
  } = useStore();
  const [showMenuItem, setShowMenuItem] = useState<string | null>(null);
  const [inputWord, setInputWord] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  const [addedPoints, setAddedPoints] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);

  const displayMessage = (message: string, timeout = 750) => {
    setMessage(message);
    setTimeout(() => setMessage(null), timeout);
  };

  const displayError = (message: string) => {
    displayMessage(message);
    setHasError(true);
    const timeout = setTimeout(() => {
      setInputWord('');
      setHasError(false);
    }, 750);
    setErrorTimeout(timeout);
  };

  const onInput = (inputWord: string) => {
    if (hasError) {
      clearTimeout(errorTimeout);
      setErrorTimeout(null);
      setMessage(null);
      setInputWord(inputWord.slice(-1));
      setHasError(false);
      return;
    }
    setInputWord(inputWord);
    if (inputWord.length >= 20) {
      displayError('Too long');
    }
  };

  const enterWord = (word: string): void => {
    const wordObj = answers.find((w) => w.value === word.toLowerCase());
    if (word.length < 4) {
      displayError('Too short');
    } else if (foundWords.find((w) => w.value === word.toLowerCase())) {
      displayError('Already found');
    } else if (wordObj) {
      updateFoundWords([wordObj, ...foundWords]);
      if (pangrams.map((w) => w.value).includes(word.toLowerCase())) {
        setReaction('Pangram!');
        setTimeout(() => setReaction(null), 750);
      }
      setAddedPoints(getPoints([wordObj]));
      setTimeout(() => setAddedPoints(null), 750);
      setInputWord('');
    } else {
      displayError('Not in word list');
    }
  };
  return (
    <div data-testid="game-index" className={'flex flex-col items-center'}>
      <Header date={displayDate} setShowMenu={setShowMenuItem} />
      <Modal
        open={showMenuItem === 'hints'}
        onClose={() => setShowMenuItem('')}
      >
        <Hints />
      </Modal>
      <Modal
        open={showMenuItem === 'rankings'}
        onClose={() => setShowMenuItem('')}
      >
        <Rankings />
      </Modal>
      <Modal
        open={showMenuItem === 'calendar'}
        onClose={() => setShowMenuItem('')}
      >
        <Calendar />
      </Modal>
      <Realistic reaction={reaction} />
      <div className="flex flex-col md:flex-row-reverse w-full">
        <div className="flex flex-col md:w-1/2 w-full md:px-2 items-center">
          <UserRanking onClickRankingName={() => setShowMenuItem('rankings')} />
          <WordList />
        </div>
        {addedPoints && <Encouragement points={addedPoints} />}
        <InputIndex
          message={message}
          hasError={hasError}
          inputWord={inputWord}
          setInputWord={onInput}
          centerLetter={centerLetter.toUpperCase()}
          enterWord={(word) => word.length > 0 && enterWord(word)}
          outerLetters={outerLetters.map((i) => i.toUpperCase())}
        />
      </div>
    </div>
  );
}
