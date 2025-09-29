import { capitalize } from './index';
import useStore from '../../useStore';

export default function FullList() {
  const { pangrams, foundWords } = useStore();
  return (
    <div className="w-full" data-testid="full-list-div">
      <div className="w-full flex flex-col flex-wrap ">
        {foundWords &&
          [...foundWords].sort().map((i) => (
            <p
              key={i.id}
              className={
                pangrams.find((w) => w.value === i.value.toLowerCase())
                  ? 'px-1 border-b border-b-gray-300 py-2 font-semibold'
                  : 'px-1 border-b border-b-gray-300 py-2'
              }
            >
              {capitalize(i.value)}
            </p>
          ))}
      </div>
    </div>
  );
}
