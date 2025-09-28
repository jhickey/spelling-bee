import { useEffect, useState } from 'react';
import { Game } from '@prisma/client';

export default function usePastGames() {
  const [pastGames, setPastGames] = useState<Game[] | null>(null);
  useEffect(() => {
    if (!pastGames) {
      fetch('/api/past-games').then((response) => {
        if (response.ok) {
          response.json().then((data) => setPastGames(data));
        }
      });
    }
  }, []);
  return pastGames;
}
