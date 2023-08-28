import React from 'react';
import { TableCell } from '@mui/material';

interface HintsTableCellProps {
  sum: number;
  found: number;
}

const HintsTableCell = ({ sum, found }: HintsTableCellProps) => {
  return (
    <TableCell className={sum === found ? 'text-green-600' : undefined}>
      {sum === 0 ? '-' : `${found}/${sum}`}
    </TableCell>
  );
};

export default HintsTableCell;
