import { BsQuestionCircle } from 'react-icons/bs';

interface HeaderProps {
  date?: string;
  setShowMenu: () => void;
}

export default function Header(props: HeaderProps) {
  const { date, setShowMenu } = props;

  return (
    <div
      className="md:p-4 flex flex-row md:justify-between w-full md:items-start justify-end "
      data-testid="header-div"
    >
      <div className="hidden md:flex flex-col">
        <div className="flex flex-row items-end">
          <h1 className="font-extrabold text-4xl pr-4">Spelling Bee</h1>
          {date && <h2 className="font-thin">{date}</h2>}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <button
          className="hover:bg-gray-100 active:bg-gray-200 text-2xl m-2 w-10 h-10 rounded-full flex items-center justify-center"
          data-testid="menu-icon"
          onClick={() => setShowMenu()}
        >
          <BsQuestionCircle />
        </button>
      </div>
    </div>
  );
}
