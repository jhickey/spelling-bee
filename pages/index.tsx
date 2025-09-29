import GameIndex from '../src/components';
import Loading from '../src/components/Loading';
import { getLatestGame, getSession } from '../src/utils/database';
import useStore, { GameState } from '../src/useStore';
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { authPage } from '../src/utils/auth';
import { calculatePoints, getHints, serializeDates } from '../src/utils/game';
import { LettersSchema } from '../src/schemas/database';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const userId = await authPage(context);
  if (!userId) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  const latestGame = await getLatestGame();
  if (!latestGame) {
    return {
      notFound: true,
    };
  }

  const session = await getSession({ gameId: latestGame.id, userId });
  const sessionWords = session ? session.words : [];

  const validLetters = LettersSchema.parse(latestGame.letters);
  const outerLetters = validLetters.filter(
    (letter) => letter !== latestGame.centerLetter
  );
  const pangrams = latestGame.answers.filter((word) =>
    validLetters.every((vl) => word.value.includes(vl))
  );
  const userPoints = session ? calculatePoints(sessionWords, validLetters) : 0;
  const gameData = {
    displayWeekday: latestGame.date.toISOString(),
    displayDate: latestGame.date.toISOString(),
    printDate: latestGame.date.toISOString(),
    answers: serializeDates(latestGame.answers),
    validLetters,
    outerLetters,
    pangrams: serializeDates(pangrams),
    centerLetter: latestGame.centerLetter,
    id: latestGame.id,
    freeExpiration: '',
    editor: '',
    foundWords: serializeDates(sessionWords),
    userPoints,
    hints: getHints(sessionWords, latestGame.answers),
  };

  return {
    props: gameData,
  };
};

export default function Home(props: Partial<GameState>) {
  useEffect(() => {
    useStore.setState(props);
  }, [props.id]);
  if (!props) {
    return <Loading />;
  }
  return (
    <>
      <Head>
        <title>Spelling Bee</title>
      </Head>
      <GameIndex />
    </>
  );
}
