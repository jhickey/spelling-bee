import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import usePastGames from '../hooks/usePastGames';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { Badge } from '@mui/material';
import { Game } from '@prisma/client';
import { isSameDay } from 'date-fns';
import Link from 'next/link';
import { TZDate } from '@date-fns/tz';

function GameDay(props: PickersDayProps & { games?: Game[] }) {
  const { games = [], day, outsideCurrentMonth, ...other } = props;
  const gameForDay = games?.find((game) => {
    return new Date(game.date).getDate() === day.getDate();
  });
  // console.log(gameForDay);

  return (
    <Link href={gameForDay ? `/game/${gameForDay.id}` : '#'}>
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={gameForDay ? '🟢' : undefined}
      >
        <PickersDay
          {...other}
          outsideCurrentMonth={outsideCurrentMonth}
          day={day}
        />
      </Badge>
    </Link>
  );
}

export default function Calendar() {
  const pastGames = usePastGames();
  return (
    <DateCalendar
      disableFuture
      slots={{
        day: GameDay,
      }}
      slotProps={
        {
          day: {
            games: pastGames,
          },
        } as any
      }
    />
  );
}
