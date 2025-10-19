import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { Badge } from "@mui/material";
import { Game } from "@prisma/client";
import { Link, useParams } from "@tanstack/react-router";
import { useArchives } from "@/hooks/useArchives.ts";
import { isSameDay } from "date-fns";
import { dateFromPrintDate } from "@/utils/game.ts";

function GameDay(props: PickersDayProps & { games?: Game[] }) {
  const { games = [], day, outsideCurrentMonth, ...other } = props;
  const { gameId } = useParams({ strict: false });

  const gameForDay = games.find((game) => {
    const gameDate = dateFromPrintDate(game.printDate);
    return !outsideCurrentMonth && isSameDay(gameDate, day);
  });

  return (
    <Link to="/game/$gameId" params={{ gameId: gameForDay?.id || "latest" }}>
      <Badge
        key={props.day.toString()}
        overlap="circular"
        badgeContent={gameForDay ? "🟢" : undefined}
        className={gameForDay && gameForDay.id === gameId ? "bg-blue-400" : ""}
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
