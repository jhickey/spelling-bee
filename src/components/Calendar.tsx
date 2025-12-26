import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { Badge } from "@mui/material";
import { useParams } from "@tanstack/react-router";
import { useArchives } from "@/hooks/useArchives";
import { isSameDay } from "date-fns";
import { dateFromPrintDate } from "@/utils/game";
import { GameWithSessions } from "@/serverFns";

function GameDay(
  props: PickersDayProps & {
    games?: GameWithSessions[];
    onSelectDate?: (gameId: string | undefined) => void;
  },
) {
  const {
    games = [],
    onSelectDate,
    day,
    outsideCurrentMonth,
    ...other
  } = props;
  const { gameId } = useParams({ strict: false });

  const gameForDay = games.find((game) => {
    const gameDate = dateFromPrintDate(game.printDate);
    return !outsideCurrentMonth && isSameDay(gameDate, day);
  });
  const hasStarted = gameForDay?.sessions[0]?.words?.length ?? 0 > 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={hasStarted ? "🟢" : undefined}
    >
      <PickersDay
        {...other}
        selected={gameForDay?.id === gameId}
        disabled={!gameForDay}
        outsideCurrentMonth={outsideCurrentMonth}
        onDaySelect={() => onSelectDate && onSelectDate(gameForDay?.id)}
        day={day}
      />
    </Badge>
  );
}

interface CalendarProps {
  onSelectDate: (gameId: string | undefined) => void;
}

export default function Calendar({ onSelectDate }: CalendarProps) {
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
      slotProps={{
        day: {
          //@ts-expect-error slotProps is not properly typed
          games: data,
          onSelectDate,
        },
      }}
    />
  );
}
