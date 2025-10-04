import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import usePastGames from "../hooks/usePastGames";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { Badge } from "@mui/material";
import { Game } from "@prisma/client";
import { Link } from "@tanstack/react-router";

function GameDay(props: PickersDayProps & { games?: Game[] }) {
  const { games = [], day, outsideCurrentMonth, ...other } = props;
  const gameForDay = games?.find((game) => {
    return new Date(game.date).getDate() === day.getDate();
  });
  // console.log(gameForDay);

  return (
    <Link to="/game/$gameId" params={{ gameId: gameForDay?.id || "latest" }}>
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={gameForDay ? "🟢" : undefined}
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
