import React from 'react';

interface HintsTableCellProps {
  sum: number;
  found: number;
}

const HintsTableCell = ({ sum, found }: HintsTableCellProps) => {
  return (
    <td className={sum === found && 'found'}>
      {sum === 0 ? '-' : `${found}/${sum}`}
    </td>
  );
};

export default HintsTableCell;
