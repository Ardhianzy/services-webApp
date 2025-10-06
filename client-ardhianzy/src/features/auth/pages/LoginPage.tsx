import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateCredentials } from "@/data/auth";

import googleLogo from "/assets/google-logos-by-hrhasnai-1.png";

type Props = {
  setIsLoggedIn: (v: boolean) => void;
};

type Errors = Partial<{ email: string; password: string; auth: string }>;

const LoginPage: React.FC<Props> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length === 0) {
      if (validateCredentials(email, password)) {
        alert("Login successful!");
        setIsLoggedIn(true);
        navigate("/");
      } else {
        newErrors.auth = "Invalid email or password";
      }
    }
    setErrors(newErrors);
  };

  return (
    <div className="relative w-full min-h-screen bg-black flex justify-center items-center font-[Roboto,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

        .form-group { position: relative; margin-bottom: 35px; }
        .form-input { transition: border-color 0.2s ease; }
        .form-label {
          position: absolute; left: 15px; top: 13px; font-size: 14px;
          color: rgba(245,245,245,0.5); pointer-events: none; transition: all 0.2s ease;
        }
        .form-input:focus + .form-label,
        .form-input:not(:placeholder-shown) + .form-label {
          top: -10px; left: 12px; font-size: 12px; color: #FFA4A4; background: #040404; padding: 0 5px;
        }
        .form-group.error .form-input { border-color: #FFA4A4; }
        .form-group.error .form-label { color: #FFA4A4; }
        .password-toggle-icon {
          position: absolute; right: 20px; top: 50%; transform: translateY(-50%);
          color: #F5F5F5; cursor: pointer; font-size: 12px; font-weight: 500; user-select: none;
        }
      `}</style>

      <div
        className="absolute left-[150px] top-0 w-[700px] h-screen z-[1]
                   bg-[url('/assets/jack-hunter-1L4E_lsIb9Q-unsplash_1.png')] bg-cover bg-no-repeat bg-center"
      />

      <div
        className="absolute left-0 top-0 w-[30%] h-full z-[2]
                   bg-[linear-gradient(to_right,rgba(0,0,0,1)_30%,rgba(0,0,0,0)_100%)]"
      />
      <div
        className="absolute right-[55rem] top-0 w-[30%] h-full z-[2]
                   bg-[linear-gradient(to_left,rgba(0,0,0,1)_30%,rgba(0,0,0,0)_100%)]"
      />

      <div
        className="box-border relative z-10 w-[474px] bg-[rgba(225,225,225,0.05)] border border-[#F5F5F5]
                   [backdrop-filter:blur(10px)] [-webkit-backdrop-filter:blur(10px)]
                   rounded-[30px] pt-10 px-10 pb-[30px] flex flex-col items-center"
      >
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          <h1
            className="m-0 self-start text-[#F5F5F5]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: 32 }}
          >
            WELCOME BACK
          </h1>
          <p className="text-[14px] text-[#B1B1B1] mt-2 mb-[30px] self-start">
            Enter your account details
          </p>

          <div className={`form-group ${errors.email ? "error" : ""}`}>
            <input
              type="email"
              id="email"
              className="form-input w-full bg-transparent border border-[#F5F5F5] rounded-[30px]
                         text-[#F5F5F5] text-[16px] py-[12px] px-[15px] outline-none
                         placeholder:text-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="email" className="form-label">Email</label>
            {errors.email && (
              <span className="absolute top-[48px] left-0 pl-[15px] flex items-center text-[#FFA4A4] text-[11px]">
                <span className="mr-[5px] text-[14px]">⚠️</span>{errors.email}
              </span>
            )}
          </div>

          <div className={`form-group ${errors.password ? "error" : ""}`}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="form-input w-full bg-transparent border border-[#F5F5F5] rounded-[30px]
                         text-[#F5F5F5] text-[16px] py-[12px] pl-[15px] pr-[60px] outline-none
                         placeholder:text-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="password" className="form-label">Password</label>
            <span
              className="password-toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && (
              <span className="absolute top-[48px] left-0 pl-[15px] flex items-center text-[#FFA4A4] text-[11px]">
                <span className="mr-[5px] text-[14px]">⚠️</span>{errors.password}
              </span>
            )}
          </div>

          <div className="w-full text-right -mt-5 mb-[25px]">
            <Link
              to="/forgot-password"
              className="no-underline"
              style={{ color: "#B1B1B1", fontSize: 12, transition: "color .2s" }}
              onMouseEnter={(e) => ((e.currentTarget.style.color = "#F5F5F5"))}
              onMouseLeave={(e) => ((e.currentTarget.style.color = "#B1B1B1"))}
            >
              Forgot password?
            </Link>
          </div>

          {errors.auth && (
            <p className="text-[#FFA4A4] text-[14px] text-center mb-[15px] -mt-[10px]">
              {errors.auth}
            </p>
          )}

          <button
            type="submit"
            className="h-[45px] rounded-[30px] cursor-pointer flex justify-center items-center gap-3
                       transition-opacity duration-300 bg-transparent border border-[#F5F5F5] text-[#F5F5F5]"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}
            onMouseEnter={(e) => ((e.currentTarget.style.opacity = "0.8"))}
            onMouseLeave={(e) => ((e.currentTarget.style.opacity = "1"))}
          >
            LOG IN
          </button>

          <div className="flex items-center text-[#B1B1B1] my-6 text-[14px]">
            <div className="flex-1 border-b" style={{ borderColor: "rgba(177,177,177,0.3)" }} />
            <span className="px-4">or</span>
            <div className="flex-1 border-b" style={{ borderColor: "rgba(177,177,177,0.3)" }} />
          </div>

          <button
            type="button"
            className="h-[45px] rounded-[30px] cursor-pointer flex justify-center items-center gap-3
                       transition-opacity duration-300 bg-[#F5F5F5] text-black border-0"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}
            onMouseEnter={(e) => ((e.currentTarget.style.opacity = "0.8"))}
            onMouseLeave={(e) => ((e.currentTarget.style.opacity = "1"))}
          >
            <img src={googleLogo} alt="Google logo" className="w-6 h-6" />
            CONTINUE WITH GOOGLE
          </button>

          <p className="text-[14px] text-center text-[#B1B1B1] mt-[30px]">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="no-underline font-medium" style={{ color: "#F5F5F5" }}>
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;