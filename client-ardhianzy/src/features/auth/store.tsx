import React from "react";
import type { User, LoginPayload } from "./types";
import * as AuthAPI from "./api";
import { rehydrateToken, getAuthToken } from "@/lib/http";

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export type AuthContextValue = AuthState & {
  login: (payload: LoginPayload) => Promise<void>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refreshProfile = React.useCallback(async () => {
    setError(null);
    const profile = await AuthAPI.getProfile();
    setUser(profile);
  }, []);

  const doLogin = React.useCallback(
    async (payload: LoginPayload) => {
      setError(null);
      setLoading(true);
      try {
        await AuthAPI.login(payload);

        // hanya panggil profile jika token berhasil diset
        if (getAuthToken()) {
          await refreshProfile();
        }
      } catch (e: any) {
        setError(e?.message || "Gagal login");
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [refreshProfile]
  );

  const doLogout = React.useCallback(() => {
    AuthAPI.logout();
    setUser(null);
  }, []);

  React.useEffect(() => {
    (async () => {
      try {
        rehydrateToken();
        const token = getAuthToken();
        if (token) {
          try {
            await refreshProfile();
          } catch (e: any) {
            if (e?.status !== 401) throw e;
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [refreshProfile]);

  const value: AuthContextValue = {
    user,
    loading,
    error,
    login: doLogin,
    refreshProfile,
    logout: doLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  return ctx;
}