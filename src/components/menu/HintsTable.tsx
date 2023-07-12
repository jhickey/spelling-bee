import { GiHamburgerMenu } from 'react-icons/gi';
import { HintsData } from '../../utils/HintsGrid';
import HintsTableRow from './HintsTableRow';

interface HintsProps {
  data: HintsData;
}

export default function HintsTable({ data }: HintsProps) {
  const { lengthColumns, letterGrid, sums, pangramCounts, startingLetters } =
    data;

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td></td>
            {lengthColumns.map((length) => (
              <td key={length}>{length}</td>
            ))}
            <td>Σ</td>
          </tr>
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
        </tbody>
      </table>
    </div>
  );
}
