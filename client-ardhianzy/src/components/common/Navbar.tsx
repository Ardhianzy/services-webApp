// src/components/common/Navbar.tsx
import { Link } from "react-router-dom";
// import UserProfile from "@/features/user/components/UserProfile";

type Props = {
  isLoggedIn?: boolean;
  handleLogout?: () => void;
  logoSrc?: string;
};

function Navbar({
  // isLoggedIn,
  // handleLogout,
  logoSrc = "/assets/icon/Ardhianzy_Logo_2.png",
}: Props) {
  // const baseBtn =
  //   "flex justify-center items-center h-[44px] px-[25px] rounded-[30px] no-underline transition-opacity duration-300 hover:opacity-80 whitespace-nowrap";
  const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

  return (
    <nav
      className="fixed top-0 left-0 w-full h-[72px] bg-black text-white flex justify-center items-center px-8 z-[2424] border-b border-[#222] box-border"
      role="navigation"
      aria-label="Primary"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>


      <div className="flex justify-center">
        <Link
          to="/"
          className="group flex items-center text-white no-underline"
          aria-label="Ardhianzy Home"
        >
          <img src={logoSrc} alt="Ardhianzy Logo" className="w-[40px] h-auto mr-2" />
          <span
            className="text-white transition-colors"
            style={{ ...bebas, fontSize: "48px", letterSpacing: "1px" }}
          >
            ARDHIANZY
          </span>
        </Link>
      </div>

      {/* <div className="flex-1 flex justify-end items-center gap-4">
        {isLoggedIn ? (
          <UserProfile handleLogout={handleLogout} />
        ) : (
          <>
            <Link
              to="/signup"
              className={`${baseBtn}`}
              style={{
                ...bebas,
                fontSize: "18px",
                fontWeight: 400,
                backgroundColor: "#000000",
                color: "#F5F5F5",
                border: "1px solid #F5F5F5",
              }}
            >
              SIGN UP
            </Link>
            <Link
              to="/login"
              className={`${baseBtn} shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
              style={{
                ...bebas,
                fontSize: "18px",
                fontWeight: 400,
                backgroundColor: "#F5F5F5",
                color: "#000000",
                border: "1px solid #000000",
              }}
            >
              LOG IN
            </Link>
          </>
        )}
      </div> */}
    </nav>
  );
}

export default Navbar;
export { Navbar };