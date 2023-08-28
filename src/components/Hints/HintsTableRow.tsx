import HintsTableCell from './HintsTableCell';
import { TableCell, TableRow } from '@mui/material';

interface HintsTableRowProps {
  letter: string;
  counts: number[][];
}

export default function HintsTableRow({ letter, counts }: HintsTableRowProps) {
  const [rowSum, rowFound] = counts.reduce(
    (acc, d) => {
      acc[0] += !d ? 0 : d[0];
      acc[1] += !d ? 0 : d[1];
      return acc;
    },
    [0, 0]
  );

  return (
    <TableRow>
      <TableCell className={rowSum === rowFound ? 'text-green-600' : ''}>
        {letter.toUpperCase()}
      </TableCell>
      {counts.map((count, index) => {
        if (!count) {
          return <TableCell />;
        }
        const [sum, found] = count;
        return <HintsTableCell sum={sum} found={found} key={index} />;
      })}
      <HintsTableCell sum={rowSum} found={rowFound} />
    </TableRow>
  );
}
