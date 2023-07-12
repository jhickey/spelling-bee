import { useState } from 'react';

interface HexagonProps {
  center: boolean;
  isShuffling?: boolean;
  letter?: string;
  setLetter: (letter: string) => void;
}

export default function Hexagon(props: HexagonProps) {
  const { letter, setLetter, isShuffling } = props;
  const [isDown, setIsDown] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const inputStart = () => {
    setLetter(letter);
    setIsDown(true);
  };
  return (
    <svg
      className={`hive-cell outer`}
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
        className={`cell-fill  ${isDown && 'push-active'}`}
        points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
        stroke="white"
        strokeWidth="7.5"
      ></polygon>
      <text
        className={`cell-letter ${isShuffling && 'shuffling'}`}
        x="50%"
        y="50%"
        dy="0.35em"
      >
        {letter}
      </text>
    </svg>
  );
}
