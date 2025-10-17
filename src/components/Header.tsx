import { BsLightbulb, BsCalendar3 } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import { format } from "date-fns";

interface HeaderProps {
  date?: Date;
  setShowMenu: (val: string) => void;
}

export default function Header(props: HeaderProps) {
  const { date, setShowMenu } = props;

  return (
    <div
      className="flex flex-row justify-between w-full"
      data-testid="header-div"
    >
      <div className="hidden md:flex flex-col">
        <div className="flex flex-row items-end">
          <h1 className="font-extrabold text-4xl pr-4">Spelling Bee</h1>
          {date && <h2 className="font-thin">{format(date, "M/dd/yyyy")}</h2>}
        </div>
      </div>
      <div className="flex flex-row justify-between gap-2 px-4">
        {/*{session?.user && (*/}
        {/*  <div className="flex items-center gap-2 mr-2">*/}
        {/*    <span className="text-sm text-red">*/}
        {/*      Welcome, {session.user.name}*/}
        {/*    </span>*/}
        {/*    <button*/}
        {/*      onClick={() => signOut()}*/}
        {/*      className="text-sm text-gray-500 hover:text-gray-700 underline"*/}
        {/*    >*/}
        {/*      Sign Out*/}
        {/*    </button>*/}
        {/*  </div>*/}
        {/*)}*/}
        <button
          className="hover:bg-gray-100 active:bg-gray-200 text-2xl m-2 w-10 h-10 rounded-full flex items-center justify-center"
          data-testid="menu-icon"
          onClick={() => setShowMenu("calendar")}
        >
          <BsCalendar3 />
        </button>
        <button
          className="hover:bg-gray-100 active:bg-gray-200 text-2xl m-2 w-10 h-10 rounded-full flex items-center justify-center"
          data-testid="menu-icon"
          onClick={() => setShowMenu("hints")}
        >
          <BsLightbulb />
        </button>
        <button
          className="hover:bg-gray-100 active:bg-gray-200 text-2xl m-2 w-10 h-10 rounded-full flex items-center justify-center"
          data-testid="menu-icon"
          onClick={() => setShowMenu("settings")}
        >
          <IoSettingsSharp />
        </button>
      </div>
    </div>
  );
}
