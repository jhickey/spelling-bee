import GameIndex from '../../src/components';
import Loading from '../../src/components/Loading';
import { getGame, getSession } from '../../src/utils/database';
import useStore, { GameState } from '../../src/useStore';
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { authPage } from '../../src/utils/auth';
import { calculatePoints, getHints } from '../../src/utils/game';
import {
  LettersSchema,
  AnswersSchema,
  WordsSchema,
} from '../../src/schemas/database';

export const getServerSideProps: GetServerSideProps<
  Partial<GameState>
> = async (context) => {
  const userId = await authPage(context);
  if (!userId) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }
  const { id } = context.params as { id: string };

  const currentGame = await getGame(id);
  if (!currentGame) {
    return {
      notFound: true,
    };
  }

  const session = await getSession({ gameId: currentGame.id, userId });

  const answers = AnswersSchema.parse(currentGame.answers);
  const validLetters = LettersSchema.parse(currentGame.letters);
  const outerLetters = validLetters.filter(
    (letter) => letter !== currentGame.centerLetter
  );
  const pangrams = answers.filter((word) =>
    validLetters.every((vl) => word.includes(vl))
  );
  const foundWords = session ? WordsSchema.parse(session.words) : [];
  const userPoints = session ? calculatePoints(foundWords, validLetters) : 0;
  const gameData = {
    displayWeekday: currentGame.date.toISOString(),
    displayDate: currentGame.date.toISOString(),
    printDate: currentGame.date.toISOString(),
    answers,
    validLetters,
    outerLetters,
    pangrams,
    centerLetter: currentGame.centerLetter,
    id: currentGame.id,
    freeExpiration: '',
    editor: '',
    foundWords,
    userPoints,
    hints: getHints(foundWords, answers),
  };

  return {
    props: gameData,
  };
};

export default function GamePage(props: Partial<GameState>) {
  useEffect(() => {
    useStore.setState(props);
  }, [props.id]);
  if (!props) {
    return <Loading />;
  }
  return <GameIndex />;
}
