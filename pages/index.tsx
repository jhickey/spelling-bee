import GameIndex from '../src/components';
import Loading from '../src/components/Loading';
import { getLatestGame, getSession } from '../src/utils/database';
import useStore, { GameState } from '../src/useStore';
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { authPage } from '../src/utils/auth';
import { calculatePoints, getHints } from '../src/utils/game';
import {
  LettersSchema,
  AnswersSchema,
  WordsSchema,
} from '../src/schemas/database';

export default function Home(props: Partial<GameState>) {
  useEffect(() => {
    useStore.setState(props);
  }, [props.id]);
  if (!props) {
    return <Loading />;
  }
  return <GameIndex />;
}
export const getServerSideProps: GetServerSideProps<
  Partial<GameState>
> = async ({ req }) => {
  const userId = await authPage(req);
  if (!userId) {
    return {
      redirect: {
        destination: '/unauthorized',
        permanent: false,
      },
    };
  }

  const data = await getLatestGame();
  if (!data) {
    return {
      notFound: true,
    };
  }

  const session = await getSession({ gameId: data.id, userId });

  const answers = AnswersSchema.parse(data.answers);
  const validLetters = LettersSchema.parse(data.letters);
  const outerLetters = validLetters.filter(
    (letter) => letter !== data.centerLetter
  );
  const pangrams = answers.filter((word) =>
    validLetters.every((vl) => word.includes(vl))
  );
  const foundWords = session ? WordsSchema.parse(session.words) : [];
  const userPoints = session ? calculatePoints(foundWords, validLetters) : 0;
  const gameData = {
    displayWeekday: data.date,
    displayDate: data.date,
    printDate: data.date,
    answers,
    validLetters,
    outerLetters,
    pangrams,
    centerLetter: data.centerLetter,
    id: data.id,
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
