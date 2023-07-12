import { calculatePangram, getRange } from './game';

type LengthColumns = number[];
type LengthSums = number[][];

interface LetterGrid {
  [letter: string]: number[][];
}

export type StartingLetters = [string, number, number][];
type PangramCounts = [number, number, number];

export interface HintsData {
  lengthColumns: LengthColumns;
  letterGrid: LetterGrid;
  sums: LengthSums;
  pangramCounts: PangramCounts;
  startingLetters: StartingLetters;
}

export interface GameData {
  answers: string[];
  foundWords: string[];
  validLetters: string[];
}

export default class HintsGrid {
  private readonly gameData: GameData;
  private readonly lengthColumns: LengthColumns;

  constructor(gameData: GameData) {
    this.gameData = gameData;
    this.lengthColumns = this.getLengthColumns();
  }

  public getData(): HintsData {
    return {
      lengthColumns: this.lengthColumns,
      letterGrid: this.getLetterGrid(),
      sums: this.getLengthSums(),
      pangramCounts: this.getPangramCounts(),
      startingLetters: this.getStartingLetters(),
    };
  }

  private getPangramCounts(): PangramCounts {
    const { answers } = this.gameData;
    return answers.reduce(
      (num, answer) => {
        if (calculatePangram(answer, this.gameData.validLetters)) {
          num[0]++;
          //Check for perfect pangram
          if (answer.length === 7) {
            num[1]++;
          }
          if (this.gameData.foundWords.includes(answer)) {
            num[2]++;
          }
        }
        return num;
      },
      [0, 0, 0]
    );
  }

  private getStartingLetters(): StartingLetters {
    // TODO clean this way up
    const theStartingLetters = this.gameData.answers.reduce((acc, answer) => {
      const firstTwo = answer.substr(0, 2);
      if (!acc[firstTwo]) {
        acc[firstTwo] = 0;
      }
      acc[firstTwo]++;
      return acc;
    }, {} as { [letter: string]: number });
    return Object.entries(theStartingLetters).map(([sl, slCount]) => {
      const slFound = this.gameData.foundWords.filter((a) =>
        a.startsWith(sl)
      ).length;
      return [sl, slCount, slFound];
    });
  }

  private getLengthColumns() {
    const { answers } = this.gameData;
    const lengthMax = Math.max(...answers.map((a) => a.length));
    return getRange(4, lengthMax);
  }

  private getLetterGrid() {
    const { answers, validLetters } = this.gameData;
    return validLetters.reduce<LetterGrid>((acc, letter) => {
      const letterCount = this.lengthColumns.map((l) => {
        return answers.reduce((count, a) => {
          const firstLetter = a.split('')[0];
          if (firstLetter === letter && a.length === l) {
            count++;
          }
          return count;
        }, 0);
      });
      acc[letter] = letterCount.map((lc, i) => {
        const foundCount = this.gameData.foundWords.filter((a) => {
          return a[0] === letter && a.length === this.lengthColumns[i];
        }).length;
        return [lc, foundCount];
      });
      return acc;
    }, {});
  }

  private getLengthSums() {
    const gridArr = Object.values(this.getLetterGrid());
    const arr = [];
    for (let i = 0; i < gridArr[0].length; i++) {
      const sum = gridArr.reduce((acc, g) => {
        acc += g[i][0];
        return acc;
      }, 0);
      arr.push(sum);
    }
    return arr.map((sum, i) => {
      const found = this.gameData.foundWords.filter(
        (ua) => ua.length === this.lengthColumns[i]
      ).length;
      return [sum, found];
    }) as LengthSums;
  }
}
