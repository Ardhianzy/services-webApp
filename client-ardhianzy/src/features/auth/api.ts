// src/features/auth/api.ts
import { http, setAuthToken, authHeader } from "@/lib/http";
import type { LoginPayload, User } from "./types";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

// Bentuk respons login berdasarkan Insomnia:
// token diakses lewat $.data.token (lihat YAML)
type LoginResponse = {
  data?: {
    token?: string;
  };
  token?: string;
  [key: string]: any;
};

export async function login(payload: LoginPayload): Promise<void> {
  const res = await http<LoginResponse>(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const token = res?.data?.token ?? (res as any)?.token;
  if (!token) {
    throw new Error("Token login tidak ditemukan pada respons.");
  }

  // Simpan token admin (sessionStorage biar tidak terlalu permanen)
  setAuthToken(token, { persist: "session" });
}

export async function getProfile(): Promise<User> {
  const res = await http<{ data: User } | User>(
    `${API_BASE}/api/auth/profile`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    }
  );

  // backend sering wrap sebagai { data: {...} }
  return (res as any).data ?? (res as any);
}

export function logout() {
  setAuthToken(null);
}