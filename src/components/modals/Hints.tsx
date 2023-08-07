import { AiOutlineClose } from 'react-icons/ai';
import HintsGrid from '../../utils/HintsGrid';
import useStore from '../../useStore';
import { useEffect, useState } from 'react';
import HintsTable from './HintsTable';
import HintsStartingLetters from './HintsStartingLetters';
import { Box, Typography } from '@mui/material';

export default function Hints() {
  const { answers, foundWords, validLetters, pangrams } = useStore();
  const [hints, setHints] = useState(null);

  useEffect(() => {
    const hintsGrid = new HintsGrid({
      answers,
      foundWords: foundWords.map((w) => w.toLowerCase()),
      validLetters,
    });
    setHints(hintsGrid.getData());
  }, [foundWords.length]);

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Hints
      </Typography>
      <Typography variant="subtitle1">
        {foundWords.length}/{answers.length} words
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
