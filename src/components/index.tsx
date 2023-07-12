import { useState } from 'react';
import Header from './header';
import WordList from './wordList';
import UserRanking from './userRanking';
import InputIndex from './input';
import Menu from './menu/menu';
import Hints from './menu/hints';
import Rankings from './menu/rankings';
import Realistic from './realistic';
import Encouragement from './encouragement';
import useStore from '../useStore';

export default function GameIndex() {
  const data = useStore();
  const { updateFoundWords, getPoints, foundWords, userPoints } = data;
  const [showMenuItem, setShowMenuItem] = useState<string | null>(null);
  const [inputWord, setInputWord] = useState<string>('');
  const [revealWords, setRevealWords] = useState<boolean>(false);
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
      return;
    }
  };

  const enterWord = (word: string): void => {
    if (word.length < 4) {
      displayError('Too short');
    } else if (foundWords.includes(word)) {
      displayError('Already found');
    } else if (data.answers.includes(word.toLowerCase())) {
      updateFoundWords([word, ...foundWords]);
      if (data.pangrams.includes(word.toLowerCase())) {
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
      <Header
        date={data.displayDate}
        editor={data.editor}
        setShowMenu={() => setShowMenuItem('hints')}
      />
      {showMenuItem === 'navbar' && (
        <Menu
          showMenuItem={showMenuItem}
          setShowMenuItem={(arg) => setShowMenuItem(arg)}
        />
      )}
      {showMenuItem === 'hints' && (
        <Hints
          revealAnswers={revealWords}
          setRevealAnswers={() => setRevealWords(true)}
          setShowMenuItem={(arg) => setShowMenuItem(arg)}
          pangrams={data.pangrams}
          answers={data.answers}
        />
      )}
      {showMenuItem === 'rankings' && (
        <Rankings
          setShowMenuItem={(arg) => setShowMenuItem(arg)}
          answers={data.answers}
        />
      )}
      <Realistic reaction={reaction} />
      <div className="flex flex-col md:flex-row-reverse w-full">
        <div className="flex flex-col md:w-1/2 w-full md:px-2 items-center">
          <UserRanking
            answers={data.answers}
            userPoints={userPoints}
            onClickRankingName={() => setShowMenuItem('rankings')}
          />
          <WordList
            answers={data.answers}
            pangrams={data.pangrams}
            revealWords={revealWords}
            words={foundWords}
          />
        </div>
        {addedPoints && <Encouragement points={addedPoints} />}
        <InputIndex
          message={message}
          hasError={hasError}
          inputWord={inputWord}
          setInputWord={onInput}
          centerLetter={data.centerLetter.toUpperCase()}
          revealedAnswers={revealWords}
          enterWord={(word) => word.length > 0 && enterWord(word)}
          outerLetters={data.outerLetters.map((i) => i.toUpperCase())}
        />
      </div>
    </div>
  );
}
