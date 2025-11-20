import { Link } from "react-router-dom";

export default function MainNavbar() {
  const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

  return (
    <nav className="fixed top-0 left-0 w-full h-[72px] bg-black text-white flex items-center justify-between px-8 z-[1000] border-b border-[#222]">
      <div className="flex-1" />

      <div className="flex-1 flex justify-center">
        <Link to="/" className="flex items-center text-white no-underline">
          <img
            src="/assets/icon/Ardhianzy_Logo 2.png"
            alt="Logo"
            className="w-[40px] h-auto mr-2"
          />
          <span
            className="text-[48px] tracking-[1px] text-white"
            style={bebas}
          >
            ARDHIANZY
          </span>
        </Link>
      </div>
    </nav>
  );
}