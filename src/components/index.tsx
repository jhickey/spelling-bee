import { useState } from "react";
import Header from "./Header";
import WordList from "./WordList";
import UserRanking from "./UserRanking";
import InputIndex from "./Game";
import Hints from "./Hints/Hints";
import Rankings from "./Rankings";
import Realistic from "./Realistic";
import Encouragement from "./Encouragement";
import Modal from "./Modal";
import Calendar from "./Calendar";
import useGame from "../hooks/useGame";
import {
  ANIMATION_DURATION,
  MAX_WORD_LENGTH,
  MIN_WORD_LENGTH,
} from "@/constants.ts";
import { calculatePoints } from "@/utils/game.ts";

export default function GameIndex() {
  const { game, session, gameState, updateSession } = useGame();

  const [inputWord, setInputWord] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [reaction, setReaction] = useState<string | null>(null);
  const [wordPointValue, setWordPointValue] = useState<number | null>(null);
  const [error, setError] = useState(false);
  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | undefined>(
    undefined,
  );

  const displayMessage = (message: string) => {
    setMessage(message);
    setTimeout(() => setMessage(null), ANIMATION_DURATION);
  };

  const displayError = (message: string) => {
    displayMessage(message);
    setError(true);
    const timeout = setTimeout(() => {
      setInputWord("");
      setError(false);
    }, ANIMATION_DURATION);
    setErrorTimeout(timeout);
  };

  const handleInput = (inputWord: string) => {
    if (error) {
      clearTimeout(errorTimeout);
      setErrorTimeout(undefined);
      setMessage(null);
      setInputWord(inputWord.slice(-1));
      setError(false);
      return;
    }
    setInputWord(inputWord);
    if (inputWord.length >= MAX_WORD_LENGTH) {
      displayError("Too long");
    }
  };

  const handleSubmit = async (word: string) => {
    if (!game || !session) {
      return;
    }
    const wordObj = game.answers.find((w) => w.value === word.toLowerCase());
    if (word.length < MIN_WORD_LENGTH) {
      displayError("Too short");
    } else if (session.words.find((w) => w.value === word.toLowerCase())) {
      displayError("Already found");
    } else if (wordObj) {
      updateSession({
        gameId: game.id,
        words: [...session.words, wordObj],
      });
      if (gameState.pangrams.map((w) => w.value).includes(word.toLowerCase())) {
        setReaction("Pangram!");
        setTimeout(() => setReaction(null), ANIMATION_DURATION);
      }
      setWordPointValue(calculatePoints([wordObj], game.letters));
      setTimeout(() => setWordPointValue(null), ANIMATION_DURATION);
      setInputWord("");
    } else {
      displayError("Not in word list");
    }
  };

  const [showMenuItem, setShowMenuItem] = useState<string | null>(null);

  if (!game || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div data-testid="game-index" className={"flex flex-col items-center"}>
      <Header date={game.date} setShowMenu={setShowMenuItem} />
      <Modal
        open={showMenuItem === "hints"}
        onClose={() => setShowMenuItem("")}
      >
        <Hints />
      </Modal>
      <Modal
        open={showMenuItem === "rankings"}
        onClose={() => setShowMenuItem("")}
      >
        <Rankings />
      </Modal>
      <Modal
        open={showMenuItem === "calendar"}
        onClose={() => setShowMenuItem("")}
      >
        <Calendar />
      </Modal>
      <Realistic reaction={reaction} />
      <div className="flex flex-col md:flex-row-reverse w-full">
        <div className="flex flex-col md:w-1/2 w-full md:px-2 items-center">
          <UserRanking onClickRankingName={() => setShowMenuItem("rankings")} />
          <WordList />
        </div>
        {wordPointValue && <Encouragement points={wordPointValue} />}
        <InputIndex
          inputWord={inputWord}
          handleInput={handleInput}
          handleSubmit={handleSubmit}
          message={message || (reaction ? reaction : "")}
          error={error}
        />
      </div>
    </div>
  );
}
