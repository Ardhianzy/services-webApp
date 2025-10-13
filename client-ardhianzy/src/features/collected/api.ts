import { endpoints } from "@/config/endpoints";
import { authHeader } from "@/lib/http";
import type { CollectedItem } from "./types";

async function httpJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
      ...(init?.headers as any),
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

function buildCollectedFormData(p: Partial<CollectedItem>): FormData {
  const fd = new FormData();
  if ((p as any).dialog) fd.set("dialog", (p as any).dialog);
  if (p.title) fd.set("judul", p.title); // YAML pakai 'judul'
  if (typeof (p as any).image === "object" && (p as any).image) {
    fd.set("image", (p as any).image as File);
  }
  return fd;
}

export async function listCollected(): Promise<CollectedItem[]> {
  const data = await httpGet<any>(endpoints.collected.list());
  return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
}
export async function getCollectedById(id: string|number): Promise<CollectedItem|null> {
  const data = await httpGet<any>(endpoints.collected.byId(id));
  return data?.data ?? data ?? null;
}
export async function getCollectedByTitle(title: string): Promise<CollectedItem|null> {
  const data = await httpGet<any>(endpoints.collected.byTitle(title));
  return data?.data ?? data ?? null;
}

export async function createCollected(payload: Partial<CollectedItem>) {
  const res = await fetch(endpoints.collected.create(), {
    method: "POST",
    headers: { ...authHeader() },
    body: buildCollectedFormData(payload),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
export async function updateCollected(id: string|number, payload: Partial<CollectedItem>) {
  return httpJson<any>(endpoints.collected.update(id), { method: "PUT", body: JSON.stringify(payload) });
}
export async function deleteCollected(id: string|number) {
  const res = await fetch(endpoints.collected.delete(id), { method: "DELETE", headers: { ...authHeader() } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return true;
}