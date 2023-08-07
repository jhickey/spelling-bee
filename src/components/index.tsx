import { useState } from 'react';
import Header from './Header';
import WordList from './WordList';
import UserRanking from './UserRanking';
import InputIndex from './input';
import Hints from './modals/Hints';
import Rankings from './modals/Rankings';
import Realistic from './realistic';
import Encouragement from './Encouragement';
import useStore from '../useStore';
import Modal from './modals/Modal';

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

  const displayMessage = (message: string, timeout = 750) => {
    setMessage(message);
    setTimeout(() => setMessage(null), timeout);
  };

  const displayError = (message: string) => {
    displayMessage(message);
    setHasError(true);
    setTimeout(() => setInputWord(''), 750);
    setTimeout(() => setHasError(false), 750);
  };

  const onInput = (inputWord: string) => {
    setInputWord(inputWord);
    if (inputWord.length >= 20) {
      displayError('Too long');
    }
  };

  const enterWord = (word: string): void => {
    if (word.length < 4) {
      displayError('Too short');
    } else if (foundWords.includes(word)) {
      displayError('Already found');
    } else if (answers.includes(word.toLowerCase())) {
      updateFoundWords([word, ...foundWords]);
      if (pangrams.includes(word.toLowerCase())) {
        setReaction('Pangram!');
        setTimeout(() => setReaction(null), 750);
      }
      setAddedPoints(getPoints([word]));
      setTimeout(() => setAddedPoints(null), 750);
      setInputWord('');
    } else {
      displayError('Not in word list');
    }
  };
  return (
    <div data-testid="game-index" className={'flex flex-col items-center'}>
      <Header date={displayDate} setShowMenu={() => setShowMenuItem('hints')} />
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
