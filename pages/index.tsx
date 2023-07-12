import GameIndex from '../src/components';
import Loading from '../src/components/loading';
import { dbGetOne, getDatabase } from '../src/utils/database';
import useStore, { GameState } from '../src/useStore';
import { useEffect } from 'react';
import { GameDataRow, GameSessionRow } from '../src/types';
import { GetServerSideProps } from 'next';
import { authPage } from '../src/utils/auth';

export default function Home(props: Partial<GameState>) {
  useEffect(() => {
    const { getPoints } = useStore.getState();
    const userPoints = getPoints(props.foundWords);
    useStore.setState({ ...props, userPoints });
  }, [props.id]);
  if (!props) {
    return <Loading />;
  }
  return <GameIndex />;
}
export const getServerSideProps: GetServerSideProps<
  Partial<GameState>
> = async ({ req, res }) => {
  const userId = await authPage(req);
  if (!userId) {
    return {
      redirect: {
        destination: '/unauthorized',
        permanent: false,
      },
    };
  }
  const db = await getDatabase();
  const data = await dbGetOne<GameDataRow>(
    db,
    'SELECT * FROM games ORDER BY date DESC LIMIT 1'
  );
  const sessionId = `${data.id}_${userId}`;
  const session = await dbGetOne<GameSessionRow>(
    db,
    `SELECT * FROM sessions WHERE id = "${sessionId}" LIMIT 1`
  );
  const answers = JSON.parse(data.answers);
  const validLetters = JSON.parse(data.letters);
  const outerLetters = validLetters.filter(
    (letter) => letter !== data.center_letter
  );
  const pangrams = answers.filter((word) =>
    validLetters.every((vl) => word.includes(vl))
  );
  const gameData = {
    displayWeekday: data.date,
    displayDate: data.date,
    printDate: data.date,
    answers,
    validLetters,
    outerLetters,
    pangrams,
    centerLetter: data.center_letter,
    id: data.id,
    freeExpiration: '',
    editor: '',
    foundWords: session ? JSON.parse(session.words) : [],
  };

  return {
    props: gameData,
  };
};
