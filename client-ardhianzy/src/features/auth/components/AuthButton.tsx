// src/features/auth/components/AuthButton.tsx
import { Link } from "react-router-dom";

export default function AuthButtons() {

  const baseBtn =
    "flex items-center justify-center h-[44px] px-[25px] rounded-[30px] no-underline text-[18px] font-normal cursor-pointer transition-opacity duration-300 whitespace-nowrap focus-visible:outline-none";

  const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

  const signUpBtn =
    "bg-black text-[#F5F5F5] border border-[#F5F5F5] hover:opacity-80 focus-visible:opacity-80";

  const loginBtn =
    "bg-[#F5F5F5] text-black border border-black shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:opacity-80 focus-visible:opacity-80";

  return (
    <div className="flex items-center gap-4">
      <Link
        to="/signup"
        aria-label="Sign up"
        className={`${baseBtn} ${signUpBtn}`}
        style={bebas}
      >
        SIGN UP
      </Link>

      <Link
        to="/login"
        aria-label="Log in"
        className={`${baseBtn} ${loginBtn}`}
        style={bebas}
      >
        LOG IN
      </Link>
    </div>
  );
}