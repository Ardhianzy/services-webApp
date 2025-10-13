import { endpoints } from "@/config/endpoints";
import { authHeader } from "@/lib/http";
import type { ShopItem } from "./types";

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

function buildShopFormData(p: Partial<ShopItem>): FormData {
  const fd = new FormData();
  if (p.title) fd.set("title", p.title);
  if (p.description) fd.set("description", p.description);
  if (p.price != null) fd.set("price", String(p.price));
  if (p.category) fd.set("category", p.category);
  if (p.condition) fd.set("condition", p.condition);
  if (p.author) fd.set("author", p.author);
  if ((p as any).researchLink) fd.set("researchLink", (p as any).researchLink);
  if (typeof (p as any).image === "object" && (p as any).image) {
    fd.set("image", (p as any).image as File);
  }
  if (p.buyer) fd.set("buyer", p.buyer);
  if (p.message) fd.set("message", p.message);
  if ((p as any).meta_title) fd.set("meta_title", (p as any).meta_title);
  if ((p as any).meta_description) fd.set("meta_description", (p as any).meta_description);
  return fd;
}

export async function listShop(): Promise<ShopItem[]> {
  const data = await httpGet<any>(endpoints.shop.list());
  return Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];
}

export async function getShopById(id: string|number): Promise<ShopItem|null> {
  const data = await httpGet<any>(endpoints.shop.byId(id));
  return data?.data ?? data ?? null;
}
export async function getShopByTitle(title: string): Promise<ShopItem|null> {
  const data = await httpGet<any>(endpoints.shop.byTitle(title));
  return data?.data ?? data ?? null;
}

export async function createShop(payload: Partial<ShopItem>) {
  const res = await fetch(endpoints.shop.create(), {
    method: "POST",
    headers: { ...authHeader() },
    body: buildShopFormData(payload),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
export async function updateShop(id: string|number, payload: Partial<ShopItem>) {
  const hasFile = typeof (payload as any).image === "object" && (payload as any).image;
  if (hasFile) {
    const res = await fetch(endpoints.shop.update(id), {
      method: "PUT",
      headers: { ...authHeader() },
      body: buildShopFormData(payload),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }
  return httpJson<any>(endpoints.shop.update(id), { method: "PUT", body: JSON.stringify(payload) });
}
export async function deleteShop(id: string|number) {
  const res = await fetch(endpoints.shop.delete(id), { method: "DELETE", headers: { ...authHeader() } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return true;
}