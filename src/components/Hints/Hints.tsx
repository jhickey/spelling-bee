import HintsGrid, { HintsData } from "../../utils/HintsGrid";
import { useEffect, useState } from "react";
import HintsTable from "./HintsTable";
import HintsStartingLetters from "./HintsStartingLetters";
import { Box, Typography } from "@mui/material";
import useGame from "../../hooks/useGame";

export default function Hints() {
  const {
    game,
    session,
    gameState: { pangrams, userPoints, totalPoints },
  } = useGame();

  const [hints, setHints] = useState<HintsData | null>(null);

  if (!game || !session) {
    return null;
  }

  useEffect(() => {
    const hintsGrid = new HintsGrid({
      answers: game.answers,
      foundWords: session.words,
      validLetters: game.letters,
    });
    setHints(hintsGrid.getData());
  }, [session.words.length]);

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Hints
      </Typography>
      <Typography variant="subtitle1">
        {session.words.length}/{game.answers.length} words
      </Typography>
      <Typography variant="subtitle1">
        {userPoints}/{totalPoints} points
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {hints?.pangramCounts[2]}/{pangrams.length} pangrams (
        {hints?.pangramCounts[1]} perfect)
      </Typography>
      {hints && <HintsTable data={hints} />}
      {hints && (
        <HintsStartingLetters startingLetters={hints.startingLetters} />
      )}
    </Box>
  );
}
