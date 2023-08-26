import { FiRefreshCcw } from 'react-icons/fi';

interface ButtonsProps {
  searchWord: () => void;
  shuffle: () => void;
  clearWord: () => void;
}

export default function Buttons(props: ButtonsProps) {
  const { searchWord, shuffle, clearWord } = props;

  return (
    <div
      className="mt-14 flex flex-row items-center justify-center "
      data-testid="buttons-div"
    >
      <button
        onClick={() => clearWord()}
        className="w-28 border m-2 py-3 px-4 rounded-full active:bg-gray-100 disabled:active:bg-white select-none"
      >
        Delete
      </button>
      <button
        className="border m-2 p-4 rounded-full active:bg-gray-100 text-xl disabled:active:bg-white select-none"
        data-testid="shuffle-btn"
        onClick={() => shuffle()}
      >
        <FiRefreshCcw />
      </button>
      <button
        onClick={() => searchWord()}
        className="w-28 border m-2 py-3 px-4 rounded-full active:bg-gray-100 disabled:active:bg-white select-none"
      >
        Enter
      </button>
    </div>
  );
}
