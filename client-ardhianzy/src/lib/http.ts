export type HttpError = Error & { status?: number; payload?: unknown };

/** ====== Token disimpan in-memory, bukan LocalStorage ====== */
const STORAGE_KEY = "auth:token";
let _authToken: string | null = null;

export function getAuthToken(): string | null {
  return _authToken;
}

// panggil ini sekali saat app start (untuk rehydrate setelah refresh)
export function rehydrateToken() {
  _authToken =
    sessionStorage.getItem(STORAGE_KEY) ??
    localStorage.getItem(STORAGE_KEY) ??
    null;
}

export function setAuthToken(
  token: string | null,
  opts?: { persist?: "memory" | "session" | "local" }
) {
  _authToken = token;

  sessionStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEY);

  if (!token) return;

  if (opts?.persist === "session") {
    sessionStorage.setItem(STORAGE_KEY, token);
  } else if (opts?.persist === "local") {
    localStorage.setItem(STORAGE_KEY, token);
  }
}

export function authHeader(): Record<string, string> {
  return _authToken ? { Authorization: `Bearer ${_authToken}` } : {};
}

async function parseMaybeJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export async function http<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    credentials: "omit",
    ...init,
    headers: {
      ...(init.headers || {}),
    },
  });
  const data = await parseMaybeJson(res);
  if (!res.ok) {
    const err: HttpError = new Error(
      (data && (data.message || (data.error as string))) || `HTTP ${res.status}`
    );
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data as T;
}