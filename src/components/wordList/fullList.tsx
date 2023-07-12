import { capitalize } from './index';
import useStore from '../../useStore';

interface FullListProps {
  words?: string[];
  revealWords: boolean;
}

export default function FullList(props: FullListProps) {
  const { words, revealWords } = props;
  const { answers, pangrams } = useStore();

  return (
    <div className="w-full" data-testid="full-list-div">
      <div className="w-full flex flex-col flex-wrap ">
        {revealWords
          ? [...answers]
              .sort((a, b) => a.length - b.length)
              .map((i) => (
                <p
                  key={i}
                  className={
                    pangrams.includes(i.toLowerCase())
                      ? 'px-1 border-b border-b-gray-300 py-2 font-semibold'
                      : 'px-1 border-b border-b-gray-300 py-2'
                  }
                >
                  <span
                    className={
                      words.includes(i.toUpperCase()) ? 'line-through' : ''
                    }
                  >
                    {capitalize(i)}
                  </span>
                </p>
              ))
          : words &&
            [...words]
              .sort((a, b) => a.length - b.length)
              .map((i) => (
                <p
                  key={i}
                  className={
                    pangrams.includes(i.toLowerCase())
                      ? 'px-1 border-b border-b-gray-300 py-2 font-semibold'
                      : 'px-1 border-b border-b-gray-300 py-2'
                  }
                >
                  {capitalize(i)}
                </p>
              ))}
      </div>
    </div>
  );
}
