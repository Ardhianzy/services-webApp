import { endpoints } from "@/config/endpoints";
import { http, authHeader, setAuthToken } from "@/lib/http";
// import type { LoginPayload, RegisterPayload, LoginResponseShape, User } from "./types";
import type { LoginPayload, LoginResponseShape, User } from "./types";

function extractToken(payload: LoginResponseShape): string | null {
  if (!payload) return null;
  if ((payload as any).token) return (payload as any).token as string;
  if ((payload as any).data?.token) return (payload as any).data.token as string;
  if ((payload as any).access_token) return (payload as any).access_token as string;
  return null;
}

export async function login(input: LoginPayload): Promise<string> {
  const res = await http<LoginResponseShape>(endpoints.login(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const token = extractToken(res);
  if (token) setAuthToken(token, { persist: "session" });
  return token ?? "";
}

// export async function register(input: RegisterPayload): Promise<unknown> {
//   const fd = new FormData();
//   fd.set("first_name", input.first_name);
//   fd.set("last_name", input.last_name);
//   fd.set("username", input.username);
//   fd.set("password", input.password);
//   if (input.image) fd.set("image", input.image);

//   return http(endpoints.register(), { method: "POST", body: fd });
// }

export async function getProfile(): Promise<User> {
  return http<User>(endpoints.profile(), {
    headers: { Accept: "application/json", ...authHeader() },
  });
}

export async function logout() {
  // optional: kalau server punya endpoint logout (hapus cookie sesi)
  try {
    await http(endpoints.logout(), {
      method: "POST",
      headers: { ...authHeader() },
    });
  } catch {
    // abaikan error: tidak semua backend punya endpoint logout
  }
  setAuthToken(null);
}