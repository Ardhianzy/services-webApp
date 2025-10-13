import { endpoints } from "@/config/endpoints";
import { authHeader } from "@/lib/http";
import type { ResearchItem } from "./types";

async function httpGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { ...authHeader() } as HeadersInit });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function listResearch(): Promise<ResearchItem[]> {
  const data = await httpGet<any>(endpoints.research.list());
  return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
}

export async function createResearch(payload: Partial<ResearchItem> & {
  pdf?: File | null; image?: File | null; field?: string; publishedAt?: string; researcher?: string;
}) {
  const fd = new FormData();
  if (payload.title) fd.set("research_title", payload.title);
  if (payload.content) fd.set("research_sum", payload.content);
  if (payload.researcher || payload.source) fd.set("researcher", String(payload.researcher ?? payload.source));
  if (payload.field) fd.set("field", payload.field);
  if (payload.keywords) fd.set("keywords", payload.keywords);
  if (payload.publishedAt) fd.set("research_date", payload.publishedAt);
  if (payload.pdf instanceof File) fd.set("pdf", payload.pdf);
  if (payload.image instanceof File) fd.set("image", payload.image);

  const res = await fetch(endpoints.research.create(), {
    method: "POST",
    headers: { ...authHeader() },
    body: fd,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}