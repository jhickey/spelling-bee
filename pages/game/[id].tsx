import GameIndex from '../../src/components';
import Loading from '../../src/components/Loading';
import { getGame, getSession } from '../../src/utils/database';
import useStore, { GameState } from '../../src/useStore';
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { authPage } from '../../src/utils/auth';
import {
  calculatePoints,
  getHints,
  serializeDates,
} from '../../src/utils/game';
import { LettersSchema } from '../../src/schemas/database';
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
  const { id } = context.params as { id: string };

  const currentGame = await getGame(id);
  if (!currentGame) {
    return {
      notFound: true,
    };
  }

  const session = await getSession({ gameId: currentGame.id, userId });

  const sessionWords = session ? session.words : [];

  const validLetters = LettersSchema.parse(currentGame.letters);
  const outerLetters = validLetters.filter(
    (letter) => letter !== currentGame.centerLetter
  );
  const pangrams = currentGame.answers.filter((answer) =>
    validLetters.every((vl) => answer.value.includes(vl))
  );
  const userPoints =
    session !== null ? calculatePoints(sessionWords, validLetters) : 0;
  const gameData = {
    displayWeekday: currentGame.date.toISOString(),
    displayDate: currentGame.date.toISOString(),
    printDate: currentGame.date.toISOString(),
    answers: serializeDates(currentGame.answers),
    validLetters,
    outerLetters,
    pangrams: serializeDates(pangrams),
    centerLetter: currentGame.centerLetter,
    id: currentGame.id,
    freeExpiration: '',
    editor: '',
    foundWords: serializeDates(sessionWords),
    userPoints,
    hints: getHints(sessionWords, currentGame.answers),
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
  return (
    <>
      <Head>
        <title>Spelling Bee</title>
      </Head>
      <GameIndex />
    </>
  );
}
