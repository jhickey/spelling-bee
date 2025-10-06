import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { Badge } from "@mui/material";
import { Game } from "@prisma/client";
import { Link } from "@tanstack/react-router";
import { useArchives } from "@/hooks/useArchives.ts";

function GameDay(props: PickersDayProps & { games?: Game[] }) {
  const { games = [], day, outsideCurrentMonth, ...other } = props;
  const gameForDay = games.find((game) => {
    return new Date(game.date).getDate() === day.getDate();
  });

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
  const { isPending, isError, data } = useArchives();
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error loading archives</div>;
  }
  return (
    <DateCalendar
      disableFuture
      slots={{
        day: GameDay,
      }}
      slotProps={
        {
          day: {
            games: data,
          },
        } as any
      }
    />
  );
}
