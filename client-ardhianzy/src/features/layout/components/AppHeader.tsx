import { Link, NavLink } from "react-router-dom";
import UserProfile from "@/features/user/components/UserProfile";

interface AppHeaderProps {
  isLoggedIn?: boolean;
  handleLogout?: () => void;
}

export default function AppHeader({ isLoggedIn, handleLogout }: AppHeaderProps) {
  const NAV_ITEMS = [
    { to: "/magazine", label: "MAGAZINE" },
    { to: "/research", label: "RESEARCH" },
    { to: "/course", label: "COURSE" },
    { to: "/monologues", label: "MONOLOGUES" },
    { to: "/ReadingGuide", label: "READING GUIDE" },
    { to: "/ideastradition", label: "IDEAS & TRADITION" },
    { to: "/PopCultureReview", label: "POP-CULTURE REVIEW" },
    { to: "/shop", label: "SHOPS" },
    { to: "/community", label: "COMMUNITY" },
  ] as const;

  return (
    <div className="fixed top-0 left-0 w-full z-[1000]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');`}</style>

      <header
        className="w-full h-[72px] bg-black text-white flex justify-between items-center px-8 border-b border-[#222] box-border"
        role="banner"
      >
        <div className="flex-1" />

        <div className="flex-1 flex justify-center">
          <Link to="/" className="flex items-center text-white no-underline" aria-label="Go to homepage">
            <img
              src="/assets/icon/Ardhianzy_Logo_2.png"
              alt="Ardhianzy Logo"
              className="w-10 h-auto mr-2"
            />
            <span
              className="text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "48px", letterSpacing: "1px" }}
            >
              ARDHIANZY
            </span>
          </Link>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
          {isLoggedIn ? (
            <UserProfile handleLogout={handleLogout} />
          ) : (
            <>
              <Link
                to="/signup"
                className="flex justify-center items-center h-[44px] px-[25px] rounded-[30px] no-underline transition-opacity duration-300"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "18px",
                  fontWeight: 400,
                  backgroundColor: "#000000",
                  color: "#F5F5F5",
                  border: "1px solid #F5F5F5",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                SIGN UP
              </Link>

              <Link
                to="/login"
                className="flex justify-center items-center h-[44px] px-[25px] rounded-[30px] no-underline shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-opacity duration-300"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "18px",
                  fontWeight: 400,
                  backgroundColor: "#F5F5F5",
                  color: "#000000",
                  border: "1px solid #000000",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                LOG IN
              </Link>
            </>
          )}
        </div>
      </header>

      <nav
        className="w-full bg-white flex justify-center py-[10px]"
        style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
        aria-label="Primary sections"
      >
        <ul className="flex list-none m-0 p-0 justify-center max-w-[1439px] w-full">
          {NAV_ITEMS.map((item) => (
            <li key={item.label} className="mx-[15px] whitespace-nowrap">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [
                    "no-underline font-['Bebas Neue'] text-[18px] tracking-[1px] transition-colors duration-300",
                    "text-black hover:text-[#555]",
                    isActive ? "font-bold text-[#333]" : "",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}