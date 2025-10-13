// src/features/tot/api.ts
import { endpoints } from "@/config/endpoints";
import { authHeader as coreAuthHeader } from "@/lib/http";
import type { BackendToT, BackendToTMeta } from "./types";

function authHeader(): Record<string, string> {
  // konsisten dengan lib/http -> return selalu Record<string,string>
  return coreAuthHeader();
}

export async function httpJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(init?.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

async function httpGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { ...authHeader() } as HeadersInit });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

/* ----------------------------
 * ToT
 * ---------------------------- */
export async function listToT(): Promise<BackendToT[]> {
  const url = endpoints.tot.list();
  const data = await httpGet<any>(url);
  // BE bisa return {data: [...]} atau langsung array -> hybrid
  return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
}

export async function getToTById(id: string | number): Promise<BackendToT | null> {
  const url = endpoints.tot.byId(id);
  const data = await httpGet<any>(url);
  return data?.data ?? data ?? null;
}

export async function createToT(payload: Partial<BackendToT> & { imageFile?: File | null }) {
  const url = endpoints.tot.create();
  const fd = new FormData();
  if (payload.philosofer) fd.append("philosofer", payload.philosofer);
  if (payload.years) fd.append("years", payload.years);
  if (payload.geoorigin) fd.append("geoorigin", payload.geoorigin);
  if (payload.detail_location) fd.append("detail_location", payload.detail_location);
  if (typeof payload.lat === "number") fd.append("lat", String(payload.lat));
  if (typeof payload.lng === "number") fd.append("lng", String(payload.lng));
  if (payload.imageFile) fd.append("image", payload.imageFile);

  const res = await fetch(url, { method: "POST", headers: { ...authHeader() }, body: fd });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function updateToT(id: string | number, payload: Partial<BackendToT> & { imageFile?: File | null }) {
  const url = endpoints.tot.update(id);
  const fd = new FormData();
  if (payload.philosofer) fd.append("philosofer", payload.philosofer);
  if (payload.years) fd.append("years", payload.years);
  if (payload.geoorigin) fd.append("geoorigin", payload.geoorigin);
  if (payload.detail_location) fd.append("detail_location", payload.detail_location);
  if (typeof payload.lat === "number") fd.append("lat", String(payload.lat));
  if (typeof payload.lng === "number") fd.append("lng", String(payload.lng));
  if (payload.imageFile) fd.append("image", payload.imageFile);

  const res = await fetch(url, { method: "PUT", headers: { ...authHeader() }, body: fd });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

/* ----------------------------
 * ToT Meta
 * ---------------------------- */
export async function listToTMeta(): Promise<BackendToTMeta[]> {
  const url = endpoints.totMeta.list();
  const data = await httpGet<any>(url);
  return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
}

export async function listToTMetaByTotId(totId: string | number): Promise<BackendToTMeta[]> {
  const url = endpoints.totMeta.byTotId(totId);
  const data = await httpGet<any>(url);
  return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
}

export async function createToTMeta(payload: {
  ToT_id: string | number;
  metafisika?: string;
  epistemologi?: string; // FE support keduanya
  epsimologi?: string;
  aksiologi?: string;
  conclusion?: string;
}) {
  const url = endpoints.totMeta.create();
  const valueEpi = payload.epistemologi ?? payload.epsimologi ?? "";
  const body = {
    ToT_id: String(payload.ToT_id),                 // pastikan ter‐serialisasi
    metafisika: payload.metafisika ?? "",
    epistemologi: valueEpi,                         // untuk BE yang sudah betul
    epsimologi: valueEpi,                           // untuk BE yang masih typo
    aksiologi: payload.aksiologi ?? "",
    conclusion: payload.conclusion ?? "",
  };
  return httpJson<any>(url, { method: "POST", body: JSON.stringify(body) });
}

export async function updateToTMeta(id: string | number, payload: Partial<{
  metafisika: string;
  epistemologi: string;
  aksiologi: string;
  conclusion: string;
}>) {
  const url = endpoints.totMeta.update(id);
  return httpJson<any>(url, { method: "PUT", body: JSON.stringify(payload) });
}

export async function deleteToTMeta(id: string | number) {
  const url = endpoints.totMeta.delete(id);
  const res = await fetch(url, { method: "DELETE", headers: { ...authHeader() } as HeadersInit });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return true;
}