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

export default function GameIndex() {
  const { gameState, reaction, wordPointValue } = useGame();

  const [showMenuItem, setShowMenuItem] = useState<string | null>(null);

  return (
    <div data-testid="game-index" className={"flex flex-col items-center"}>
      <Header date={gameState.game.date} setShowMenu={setShowMenuItem} />
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
        <InputIndex />
      </div>
    </div>
  );
}
