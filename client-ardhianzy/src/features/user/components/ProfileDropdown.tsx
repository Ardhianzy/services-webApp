import { Link } from "react-router-dom";

type ProfileDropdownProps = {
  handleLogout?: () => void;
};

export default function ProfileDropdown({ handleLogout }: ProfileDropdownProps) {
  const font = { fontFamily: "'Roboto', sans-serif" };

  const itemClass =
    "block px-4 py-2 no-underline text-[#F5F5F5] hover:bg-[#222] " +
    "focus:bg-[#222] focus:outline-none";

  return (
    <>
      <div
        className="
          absolute top-[60px] right-0 z-[1010]
          w-[148px] rounded-[8px] border border-[#222] bg-black
          py-2 text-[14px] text-[#F5F5F5]
        "
        style={{ ...font, animation: "fadeIn 0.2s ease-out" }}
        role="menu"
        aria-label="Profile menu"
      >
        <ul className="list-none m-0 p-0">
          <li>
            <Link to="/profile" className={itemClass} role="menuitem">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/read-history" className={itemClass} role="menuitem">
              Read History
            </Link>
          </li>
        </ul>

        <div className="my-2 h-px bg-[#B1B1B1] opacity-50" />

        <button
          type="button"
          onClick={handleLogout}
          className={`${itemClass} w-full text-left bg-transparent border-0 cursor-pointer`}
          role="menuitem"
        >
          Log Out
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}