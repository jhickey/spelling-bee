import { useMemo, useState } from "react";
import useGame from "@/hooks/useGame.ts";
import cn from "classnames";
import { useUser } from "@/hooks/useUser.ts";

interface HexagonProps {
  center: boolean;
  isShuffling?: boolean;
  letter: string;
  setLetter: (letter: string) => void;
}

export default function Hexagon(props: HexagonProps) {
  const { letter, setLetter, isShuffling } = props;
  const [isDown, setIsDown] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const {
    gameState: { hints, showRemainingTotals, showRemainingStarts },
  } = useGame();
  const { data } = useUser();
  const inputStart = () => {
    setLetter(letter);
    setIsDown(true);
  };
  const remainingStart = useMemo(() => {
    return hints?.remainingStarts[letter] ?? 0;
  }, [hints, letter]);
  const remainingTotal = useMemo(() => {
    return hints?.remainingTotals[letter] ?? 0;
  }, [hints, letter]);

  const showLetterDepleted = data?.settings.showLetterDepleted ?? true;

  return (
    <svg
      className="hive-cell outer"
      viewBox="0 0 120 103.92304845413263"
      data-testid="hive-cell"
      onMouseDown={() => {
        !isTouch && inputStart();
      }}
      onMouseUp={() => !isTouch && setIsDown(false)}
      onTouchStart={() => {
        setIsTouch(true);
        inputStart();
      }}
      onTouchEnd={() => setIsDown(false)}
    >
      <polygon
        className={`cell-fill  ${isDown && "push-active"}`}
        points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
        stroke="white"
        strokeWidth="7.5"
      ></polygon>
      <text
        className={cn(
          "cell-letter",
          showLetterDepleted && remainingStart === 0 && remainingTotal === 0
            ? "opacity-25"
            : "opacity-100",
          {
            shuffling: isShuffling,
          },
        )}
        x="50%"
        y="50%"
        dy="0.35em"
      >
        {letter}
      </text>
      {showRemainingStarts && remainingStart && (
        <text
          className={`remaining-start ${isShuffling && "shuffling"}`}
          x="35%"
          y="75%"
          dy="0.35em"
        >
          {remainingStart}
        </text>
      )}
      {showRemainingTotals && remainingTotal && (
        <text
          className={`remaining-total ${isShuffling && "shuffling"}`}
          x="65%"
          y="75%"
          dy="0.35em"
        >
          {remainingTotal}
        </text>
      )}
    </svg>
  );
}
