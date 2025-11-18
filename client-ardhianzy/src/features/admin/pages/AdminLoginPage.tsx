// src/features/admin/pages/AdminLoginPage.tsx
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/store";
import { ROUTES } from "@/app/routes";

const AdminLoginPage: React.FC = () => {
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleAdminLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);

    if (!adminUsername || !adminPassword) {
      setAuthError("Username dan password harus diisi.");
      return;
    }

    try {
      await login({ username: adminUsername, password: adminPassword });

      navigate(ROUTES.ADMIN.ROOT);
    } catch (err: any) {
      setAuthError(err?.message || "Username atau password admin salah.");
    }
  };

  return (
    <div
      className="relative w-full min-h-screen bg-black flex justify-center items-center"
      style={{ fontFamily: "'Roboto', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap');

        .admin-form-group { position: relative; margin-bottom: 35px; }
        .admin-form-input { transition: border-color 0.2s ease; }
        .admin-form-label {
          position: absolute; left: 15px; top: 13px; font-size: 14px;
          color: rgba(245,245,245,0.5); pointer-events: none; transition: all .2s ease;
        }
        .admin-form-input:focus + .admin-form-label,
        .admin-form-input:not(:placeholder-shown) + .admin-form-label {
          top: -10px; left: 12px; font-size: 12px; color: #FFA4A4; background: #040404; padding: 0 5px;
        }
      `}</style>

      <div
        className="absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,.92) 10%, rgba(0,0,0,.75) 20%, rgba(0,0,0,.45) 35%, rgba(0,0,0,0) 60%), url('/assets/admin/geoMap.png')",
          backgroundPosition: "left top, right bottom",
          backgroundSize: "330% 100%, auto 100%",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
        aria-hidden="true"
      />

      <div
        className="relative z-10 w-[474px] bg-[rgba(225,225,225,0.05)] border border-[#F5F5F5]
                   rounded-[30px] p-10 flex flex-col items-center
                   [backdrop-filter:blur(10px)] [-webkit-backdrop-filter:blur(10px)]"
      >
        <form onSubmit={handleAdminLogin} className="w-full flex flex-col">
          <h1
            className="font-normal text-[32px] text-[#F5F5F5] m-0 self-start"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            ADMIN LOG IN
          </h1>
          <p className="text-[14px] text-[#B1B1B1] mt-2 mb-[30px] self-start">
            Hallo Ardhianzy! Silahkan masuk untuk mengelola dasbor
          </p>

          <div className="admin-form-group">
            <input
              type="text"
              id="admin-email"
              className="admin-form-input w-full bg-transparent border border-[#F5F5F5] rounded-[30px]
                         text-[#F5F5F5] text-[16px] py-[12px] px-[15px] outline-none
                         placeholder:text-transparent"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              required
              placeholder=" "
              autoComplete="username"
            />
            <label htmlFor="admin-email" className="admin-form-label">
              Admin Username
            </label>
          </div>

          <div className="admin-form-group">
            <input
              type={showAdminPassword ? "text" : "password"}
              id="admin-password"
              className="admin-form-input w-full bg-transparent border border-[#F5F5F5] rounded-[30px]
                         text-[#F5F5F5] text-[16px] py-[12px] pl-[15px] pr-[60px] outline-none
                         placeholder:text-transparent"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
              placeholder=" "
              autoComplete="current-password"
            />
            <label htmlFor="admin-password" className="admin-form-label">
              Admin Password
            </label>
            <span
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[#F5F5F5] cursor-pointer text-[12px] font-medium select-none"
              onClick={() => setShowAdminPassword(!showAdminPassword)}
            >
              {showAdminPassword ? "Hide" : "Show"}
            </span>
          </div>

          {authError && (
            <p className="text-[#FFA4A4] text-[14px] text-center mb-5 -mt-[15px]">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-[45px] rounded-[30px] text-[18px] cursor-pointer
                       transition-opacity duration-300 flex justify-center items-center gap-3 mt-[10px]
                       bg-transparent border border-[#F5F5F5] text-[#F5F5F5]
                       focus:outline-none focus:ring-2 focus:ring-white/60
                       hover:text-black hover:bg-white hover:border-black
                       disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {loading ? "LOGGING IN..." : "LOG IN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;