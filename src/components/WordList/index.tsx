import { useState } from 'react';
import FullList from './FullList';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Fade,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useStore from '../../useStore';

export const capitalize = (word: string): string => {
  const capitalized = word;
  const arr = capitalized.split('');
  let newWord = arr[0].toUpperCase();
  for (let i = 1; i < arr.length; i++) {
    newWord = newWord + arr[i].toLowerCase();
  }
  return newWord;
};

export default function WordList() {
  const { foundWords } = useStore();
  const [showList, setShowList] = useState(false);

  return (
    <Container>
      <Accordion expanded={showList} onChange={() => setShowList(!showList)}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          sx={{
            overflow: 'hidden',
            justifyContent: 'flex-start',
          }}
        >
          {showList ? (
            <Fade in>
              <Typography>You have found {foundWords.length} words</Typography>
            </Fade>
          ) : (
            <Box
              sx={{
                maxWidth: '95%',
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  overflow: 'hidden',
                }}
              >
                {foundWords.map((word) => {
                  return (
                    <Fade key={word} in timeout={1500}>
                      <Box>
                        <Typography>{capitalize(word)}</Typography>
                      </Box>
                    </Fade>
                  );
                })}
              </Stack>
            </Box>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <FullList />
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}
