import { HintsData } from '../../utils/HintsGrid';
import HintsTableRow from './HintsTableRow';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';

interface HintsProps {
  data: HintsData;
}

export default function HintsTable({ data }: HintsProps) {
  const { lengthColumns, letterGrid, sums } = data;

  return (
    <div>
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell />
              {lengthColumns.map((length, index) => (
                <TableCell
                  key={length}
                  className={
                    sums[index][0] === sums[index][1] ? 'text-green-600' : ''
                  }
                >
                  {length}
                </TableCell>
              ))}
              <TableCell>Σ</TableCell>
            </TableRow>
            {Object.entries(letterGrid)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([startLetter, counts], index) => {
                return (
                  <HintsTableRow
                    letter={startLetter}
                    counts={counts}
                    key={index}
                  />
                );
              })}
            <HintsTableRow letter="Σ" counts={sums} />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
