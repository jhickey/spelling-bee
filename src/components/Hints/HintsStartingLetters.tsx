import { StartingLetters } from '../../utils/HintsGrid';

interface HintsStartingLettersProps {
  startingLetters: StartingLetters;
}

interface StartingLetterObj {
  letters: string;
  found: number;
  count: number;
  allFound: boolean;
}

type StartingLetterGroup = { [letter: string]: StartingLetterObj[] };
export default function HintsStartingLetters({
  startingLetters,
}: HintsStartingLettersProps) {
  const groupedStartingLetters = startingLetters
    .sort()
    .reduce<StartingLetterGroup>((acc, [sl, c, f]) => {
      if (!acc[sl[0]]) {
        acc[sl[0]] = [];
      }
      acc[sl[0]].push({
        letters: sl,
        found: f,
        count: c,
        allFound: f === c,
      });
      return acc;
    }, {});
  return (
    <div style={{ marginTop: '15px' }}>
      {Object.values(groupedStartingLetters).map((gsl, i) => {
        return (
          <div key={`gsl_${i}`}>
            {gsl.map((g, j) => {
              return (
                <span
                  key={`sl_${j}`}
                  className={`mr-3 ${g.allFound && 'text-green-600'}`}
                >
                  {g.letters.toUpperCase()}: {g.found}/{g.count}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
