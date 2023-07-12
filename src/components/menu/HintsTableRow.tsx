import HintsTableCell from './HintsTableCell';

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
    <tr>
      <td className={rowSum === rowFound ? 'found' : ''}>
        {letter.toUpperCase()}
      </td>
      {counts.map((count, index) => {
        if (!count) {
          return <td></td>;
        }
        const [sum, found] = count;
        return <HintsTableCell sum={sum} found={found} key={index} />;
      })}
      <HintsTableCell sum={rowSum} found={rowFound} />
    </tr>
  );
}
