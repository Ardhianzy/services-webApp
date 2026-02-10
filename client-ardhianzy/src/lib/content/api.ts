// src/lib/content/api.ts
import { useEffect, useState } from "react";
import type {
  ListResponse,
  MagazineDTO,
  ResearchDTO,
  MonologueDTO,
  ArticleDTO,
  ArticleCategory,
  ShopDTO,
  ToTDTO,
  ToTMetaDTO as ToTMetaDTOBase,
  LatestYoutubeDTO,
  Pagination,
} from "./types";
import { http, authHeader } from "@/lib/http";

/* =============================================================================
   BASE URL
============================================================================= */

const ADMIN_API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") || "";

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

/* =============================================================================
   SHARED HELPERS (Pagination + List Normalizer)
============================================================================= */

type PageParams = {
  page?: number;
  limit?: number;
  signal?: AbortSignal;
};

function buildUrlWithPagination(baseUrl: string, params?: PageParams): string {
  if (!params) return baseUrl;

  const queryParts: string[] = [];

  if (typeof params.page === "number" && !Number.isNaN(params.page)) {
    queryParts.push(`page=${encodeURIComponent(params.page)}`);
  }

  if (typeof params.limit === "number" && !Number.isNaN(params.limit)) {
    queryParts.push(`limit=${encodeURIComponent(params.limit)}`);
  }

  if (!queryParts.length) return baseUrl;
  return baseUrl + (baseUrl.includes("?") ? "&" : "?") + queryParts.join("&");
}

function toNum(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function normalizePaginationLike(rawPg: any, fallbackTotal: number): Pagination {
  const total = toNum(rawPg?.total, fallbackTotal);
  const page = toNum(rawPg?.page, 1);
  const limit = toNum(rawPg?.limit, Math.max(1, fallbackTotal || 1));

  const totalPagesRaw = rawPg?.totalPages ?? rawPg?.total_pages;
  const totalPages =
    Number.isFinite(Number(totalPagesRaw))
      ? Math.max(0, Number(totalPagesRaw))
      : limit > 0
        ? Math.max(0, Math.ceil(total / limit))
        : 0;

  const hasPrevRaw = rawPg?.hasPreviousPage ?? rawPg?.has_previous_page;
  const hasNextRaw = rawPg?.hasNextPage ?? rawPg?.has_next_page;

  const hasPreviousPage =
    typeof hasPrevRaw === "boolean" ? hasPrevRaw : page > 1;

  const hasNextPage =
    typeof hasNextRaw === "boolean" ? hasNextRaw : page < totalPages;

  return { total, page, limit, totalPages, hasNextPage, hasPreviousPage };
}

function ensurePagination<T>(data: T[], pagination?: any): Pagination {
  if (pagination) return normalizePaginationLike(pagination, data.length);

  const total = data.length;
  return {
    total,
    page: 1,
    limit: total || 1,
    totalPages: total > 0 ? 1 : 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };
}

function pickArrayFromUnknown<T>(anyRaw: any): T[] | null {
  if (Array.isArray(anyRaw)) return anyRaw as T[];
  if (Array.isArray(anyRaw?.data)) return anyRaw.data as T[];
  if (Array.isArray(anyRaw?.rows)) return anyRaw.rows as T[];
  if (Array.isArray(anyRaw?.result)) return anyRaw.result as T[];

  if (Array.isArray(anyRaw?.data?.data)) return anyRaw.data.data as T[];
  if (Array.isArray(anyRaw?.data?.rows)) return anyRaw.data.rows as T[];

  return null;
}

function pickPaginationFromUnknown(anyRaw: any): any | undefined {
  return (
    anyRaw?.pagination ??
    anyRaw?.pageInfo ??
    anyRaw?.meta?.pagination ??
    anyRaw?.data?.pagination ??
    anyRaw?.data?.pageInfo ??
    anyRaw?.data?.meta?.pagination
  );
}

function normalizeListResponse<T>(
  raw:
    | ListResponse<T>
    | T[]
    | { data?: T[]; pagination?: Pagination; success?: boolean; message?: string }
    | unknown
): ListResponse<T> {
  const anyRaw: any = raw as any;

  const arr = pickArrayFromUnknown<T>(anyRaw) ?? [];
  const pg = pickPaginationFromUnknown(anyRaw);

  return {
    success: typeof anyRaw?.success === "boolean" ? anyRaw.success : true,
    message: typeof anyRaw?.message === "string" ? anyRaw.message : anyRaw?.message,
    data: arr,
    pagination: ensurePagination(arr, pg),
  };
}

export function unwrapList<T>(payload: ListResponse<T> | T[] | unknown): T[] {
  return normalizeListResponse<T>(payload as any).data;
}

function unwrapAdminDetail<T>(payload: T | { data?: T }): T {
  if ((payload as any)?.data !== undefined) {
    return (payload as any).data as T;
  }
  return payload as T;
}

/* =============================================================================
   ADMIN: GET/LIST/READ HELPERS
============================================================================= */

async function adminGetList<T>(
  path: string,
  params?: PageParams
): Promise<ListResponse<T>> {
  const baseUrl = `${ADMIN_API_BASE}${path}`;
  const url = buildUrlWithPagination(baseUrl, params);

  const res = await http<
    | ListResponse<T>
    | T[]
    | { data?: T[]; pagination?: Pagination; success?: boolean; message?: string }
    | unknown
  >(url, {
    method: "GET",
    headers: {
      ...authHeader(),
    },
    signal: params?.signal,
  });

  return normalizeListResponse<T>(res);
}

async function adminGetDetail<T>(
  path: string,
  opts?: { signal?: AbortSignal }
): Promise<T> {
  const res = await http<T | { data?: T }>(`${ADMIN_API_BASE}${path}`, {
    method: "GET",
    headers: { ...authHeader() },
    signal: opts?.signal,
  });

  return unwrapAdminDetail<T>(res);
}

async function adminScanById<T extends { id?: any }>(
  fetchPage: (params?: PageParams) => Promise<ListResponse<T>>,
  id: string,
  opts?: { limit?: number; maxPages?: number; signal?: AbortSignal }
): Promise<T | null> {
  const limit =
    typeof opts?.limit === "number" && opts.limit > 0 ? opts.limit : 50;
  const maxPages =
    typeof opts?.maxPages === "number" && opts.maxPages > 0 ? opts.maxPages : 10;

  for (let page = 1; page <= maxPages; page += 1) {
    const res = await fetchPage({ page, limit, signal: opts?.signal });
    const found = res.data.find((x) => String(x.id) === String(id));
    if (found) return found;

    const pg = res.pagination;
    if (!pg || !pg.hasNextPage || page >= (pg.totalPages ?? page)) break;
  }

  return null;
}

/* =============================================================================
   ADMIN: ARTICLES
============================================================================= */

export async function adminFetchArticlesPaginated(
  params?: PageParams
): Promise<ListResponse<ArticleDTO>> {
  return adminGetList<ArticleDTO>("/api/articel", params);
}

export async function adminFetchArticles(
  params?: PageParams
): Promise<ArticleDTO[]> {
  const res = await adminFetchArticlesPaginated(params);
  return res.data;
}

export async function adminGetArticleById(
  id: string,
  opts?: { signal?: AbortSignal }
): Promise<ArticleDTO> {
  try {
    return await adminGetDetail<ArticleDTO>(`/api/articel/${id}`, opts);
  } catch {
    const found = await adminScanById<ArticleDTO>(adminFetchArticlesPaginated, id, {
      limit: 50,
      maxPages: 10,
      signal: opts?.signal,
    });
    if (!found) throw new Error("Artikel tidak ditemukan.");
    return found;
  }
}

export async function adminCreateArticle(formData: FormData): Promise<ArticleDTO> {
  const res = await http<ArticleDTO | { data?: ArticleDTO }>(
    `${ADMIN_API_BASE}/api/articel`,
    {
      method: "POST",
      body: formData,
      headers: {
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<ArticleDTO>(res);
}

export async function adminUpdateArticle(
  id: string,
  formData: FormData
): Promise<ArticleDTO> {
  const res = await http<ArticleDTO | { data?: ArticleDTO }>(
    `${ADMIN_API_BASE}/api/articel/${id}`,
    {
      method: "PUT",
      body: formData,
      headers: {
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<ArticleDTO>(res);
}

export async function adminDeleteArticle(id: string): Promise<void> {
  await http<void | { data?: unknown }>(`${ADMIN_API_BASE}/api/articel/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });
}

/* =============================================================================
   ADMIN: MAGAZINES
============================================================================= */

export async function adminFetchMagazinesPaginated(
  params?: PageParams
): Promise<ListResponse<MagazineDTO>> {
  return adminGetList<MagazineDTO>("/api/megazine", params);
}

export async function adminFetchMagazines(
  params?: PageParams
): Promise<MagazineDTO[]> {
  const res = await adminFetchMagazinesPaginated(params);
  return res.data;
}

export async function adminGetMagazineById(
  id: string,
  opts?: { signal?: AbortSignal }
): Promise<MagazineDTO> {
  try {
    return await adminGetDetail<MagazineDTO>(`/api/megazine/${id}`, opts);
  } catch {
    const found = await adminScanById<MagazineDTO>(
      adminFetchMagazinesPaginated,
      id,
      { limit: 50, maxPages: 10, signal: opts?.signal }
    );
    if (!found) throw new Error("Magazine tidak ditemukan.");
    return found;
  }
}

export async function adminCreateMagazine(
  formData: FormData
): Promise<MagazineDTO> {
  const res = await http<MagazineDTO | { data?: MagazineDTO }>(
    `${ADMIN_API_BASE}/api/megazine`,
    {
      method: "POST",
      body: formData,
      headers: {
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<MagazineDTO>(res);
}

export async function adminUpdateMagazine(
  id: string,
  formData: FormData
): Promise<MagazineDTO> {
  const res = await http<MagazineDTO | { data?: MagazineDTO }>(
    `${ADMIN_API_BASE}/api/megazine/${id}`,
    {
      method: "PUT",
      body: formData,
      headers: {
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<MagazineDTO>(res);
}

export async function adminDeleteMagazine(id: string): Promise<void> {
  await http<void | { data?: unknown }>(`${ADMIN_API_BASE}/api/megazine/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });
}

/* =============================================================================
   ADMIN: MONOLOGUES
============================================================================= */

export async function adminFetchMonologuesPaginated(
  params?: PageParams
): Promise<ListResponse<MonologueDTO>> {
  return adminGetList<MonologueDTO>("/api/monologues", params);
}

export async function adminFetchMonologues(
  params?: PageParams
): Promise<MonologueDTO[]> {
  const res = await adminFetchMonologuesPaginated(params);
  return res.data;
}

export async function adminGetMonologueById(
  id: string,
  opts?: { signal?: AbortSignal }
): Promise<MonologueDTO> {
  try {
    return await adminGetDetail<MonologueDTO>(`/api/monologues/${id}`, opts);
  } catch {
    const found = await adminScanById<MonologueDTO>(
      adminFetchMonologuesPaginated,
      id,
      { limit: 50, maxPages: 10, signal: opts?.signal }
    );
    if (!found) throw new Error("Monologue tidak ditemukan.");
    return found;
  }
}

export async function adminCreateMonologue(
  formData: FormData
): Promise<MonologueDTO> {
  const res = await http<MonologueDTO | { data?: MonologueDTO }>(
    `${ADMIN_API_BASE}/api/monologues`,
    {
      method: "POST",
      body: formData,
      headers: {
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<MonologueDTO>(res);
}

export async function adminUpdateMonologue(
  id: string,
  formData: FormData
): Promise<MonologueDTO> {
  const res = await http<MonologueDTO | { data?: MonologueDTO }>(
    `${ADMIN_API_BASE}/api/monologues/${id}`,
    {
      method: "PUT",
      body: formData,
      headers: {
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<MonologueDTO>(res);
}

export async function adminDeleteMonologue(id: string): Promise<void> {
  await http<void | { data?: unknown }>(
    `${ADMIN_API_BASE}/api/monologues/${id}`,
    {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    }
  );
}

/* =============================================================================
   ADMIN: RESEARCH
============================================================================= */

export async function adminFetchResearchPaginated(
  params?: PageParams
): Promise<ListResponse<ResearchDTO>> {
  return adminGetList<ResearchDTO>("/api/research", params);
}

export async function adminFetchResearch(
  params?: PageParams
): Promise<ResearchDTO[]> {
  const res = await adminFetchResearchPaginated(params);
  return res.data;
}

export async function adminGetResearchById(
  id: string,
  opts?: { signal?: AbortSignal }
): Promise<ResearchDTO> {
  try {
    return await adminGetDetail<ResearchDTO>(`/api/research/${id}`, opts);
  } catch {
    const found = await adminScanById<ResearchDTO>(
      adminFetchResearchPaginated,
      id,
      { limit: 50, maxPages: 10, signal: opts?.signal }
    );
    if (!found) throw new Error("Research tidak ditemukan.");
    return found;
  }
}

export async function adminCreateResearch(
  formData: FormData
): Promise<ResearchDTO> {
  const res = await http<ResearchDTO | { data?: ResearchDTO }>(
    `${ADMIN_API_BASE}/api/research`,
    {
      method: "POST",
      body: formData,
      headers: {
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<ResearchDTO>(res);
}

export async function adminUpdateResearch(
  id: string,
  formData: FormData
): Promise<ResearchDTO> {
  const res = await http<ResearchDTO | { data?: ResearchDTO }>(
    `${ADMIN_API_BASE}/api/research/${id}`,
    {
      method: "PUT",
      body: formData,
      headers: {
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<ResearchDTO>(res);
}

export async function adminDeleteResearch(id: string): Promise<void> {
  await http<void | { data?: unknown }>(
    `${ADMIN_API_BASE}/api/research/${id}`,
    {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    }
  );
}

/* =============================================================================
   ADMIN: SHOP
============================================================================= */

export async function adminFetchShopsPaginated(
  params?: PageParams
): Promise<ListResponse<ShopDTO>> {
  return adminGetList<ShopDTO>("/api/shop", params);
}

export async function adminFetchShops(params?: PageParams): Promise<ShopDTO[]> {
  const res = await adminFetchShopsPaginated(params);
  return res.data;
}

export async function adminGetShopById(
  id: string,
  opts?: { signal?: AbortSignal }
): Promise<ShopDTO> {
  try {
    return await adminGetDetail<ShopDTO>(`/api/shop/${id}`, opts);
  } catch {
    const found = await adminScanById<ShopDTO>(adminFetchShopsPaginated, id, {
      limit: 50,
      maxPages: 10,
      signal: opts?.signal,
    });
    if (!found) throw new Error("Shop item tidak ditemukan.");
    return found;
  }
}

export async function adminCreateShop(formData: FormData): Promise<ShopDTO> {
  const res = await http<ShopDTO | { data?: ShopDTO }>(
    `${ADMIN_API_BASE}/api/shop`,
    {
      method: "POST",
      body: formData,
      headers: {
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<ShopDTO>(res);
}

export async function adminUpdateShop(
  id: string,
  formData: FormData
): Promise<ShopDTO> {
  const res = await http<ShopDTO | { data?: ShopDTO }>(
    `${ADMIN_API_BASE}/api/shop/${id}`,
    {
      method: "PUT",
      body: formData,
      headers: {
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<ShopDTO>(res);
}

export async function adminDeleteShop(id: string): Promise<void> {
  await http<void | { data?: unknown }>(`${ADMIN_API_BASE}/api/shop/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(),
    },
  });
}

/* =============================================================================
   ADMIN: ToT (Timeline of Thought)
============================================================================= */

export async function adminFetchToTPaginated(
  params?: PageParams
): Promise<ListResponse<ToTDTO>> {
  return adminGetList<ToTDTO>("/api/ToT", params);
}

export async function adminFetchToT(params?: PageParams): Promise<ToTDTO[]> {
  const res = await adminFetchToTPaginated(params);
  return res.data;
}

export async function adminGetToTById(
  id: string,
  opts?: { signal?: AbortSignal }
): Promise<ToTDTO> {
  try {
    return await adminGetDetail<ToTDTO>(`/api/tot/${id}`, opts);
  } catch {
    try {
      return await adminGetDetail<ToTDTO>(`/api/ToT/${id}`, opts);
    } catch {
      const found = await adminScanById<ToTDTO>(adminFetchToTPaginated, id, {
        limit: 50,
        maxPages: 10,
        signal: opts?.signal,
      });
      if (!found) throw new Error("ToT tidak ditemukan.");
      return found;
    }
  }
}

export async function adminCreateToT(formData: FormData): Promise<ToTDTO> {
  const res = await http<ToTDTO | { data?: ToTDTO }>(
    `${ADMIN_API_BASE}/api/ToT`,
    {
      method: "POST",
      body: formData,
      headers: {
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<ToTDTO>(res);
}

export async function adminUpdateToT(
  id: string,
  formData: FormData
): Promise<ToTDTO> {
  try {
    const res = await http<ToTDTO | { data?: ToTDTO }>(
      `${ADMIN_API_BASE}/api/tot/${id}`,
      {
        method: "PUT",
        body: formData,
        headers: {
          ...authHeader(),
        },
      }
    );
    return unwrapAdminDetail<ToTDTO>(res);
  } catch {
    const res = await http<ToTDTO | { data?: ToTDTO }>(
      `${ADMIN_API_BASE}/api/ToT/${id}`,
      {
        method: "PUT",
        body: formData,
        headers: {
          ...authHeader(),
        },
      }
    );
    return unwrapAdminDetail<ToTDTO>(res);
  }
}

export async function adminDeleteToT(id: string): Promise<void> {
  try {
    await http<void | { data?: unknown }>(`${ADMIN_API_BASE}/api/tot/${id}`, {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    });
  } catch {
    await http<void | { data?: unknown }>(`${ADMIN_API_BASE}/api/ToT/${id}`, {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    });
  }
}

/* =============================================================================
   ADMIN: ToT Meta
============================================================================= */

export type ToTMetaDTO = ToTMetaDTOBase;

export async function adminFetchToTMetaPaginated(
  params?: PageParams
): Promise<ListResponse<ToTMetaDTO>> {
  return adminGetList<ToTMetaDTO>("/api/tot-meta", params);
}

export async function adminFetchToTMeta(
  params?: PageParams
): Promise<ToTMetaDTO[]> {
  const res = await adminFetchToTMetaPaginated(params);
  return res.data;
}

export async function adminGetToTMetaById(
  id: string,
  opts?: { signal?: AbortSignal }
): Promise<ToTMetaDTO> {
  try {
    return await adminGetDetail<ToTMetaDTO>(`/api/tot-meta/${id}`, opts);
  } catch {
    const found = await adminScanById<ToTMetaDTO>(
      adminFetchToTMetaPaginated as any,
      id,
      { limit: 50, maxPages: 10, signal: opts?.signal }
    );
    if (!found) throw new Error("ToT Meta tidak ditemukan.");
    return found as ToTMetaDTO;
  }
}

export async function adminCreateToTMeta(
  payload: Partial<ToTMetaDTO> & { ToT_id: string }
): Promise<ToTMetaDTO> {
  const body = {
    ToT_id: payload.ToT_id,
    metafisika: payload.metafisika ?? null,
    epsimologi: payload.epsimologi ?? null,
    aksiologi: payload.aksiologi ?? null,
    conclusion: payload.conclusion ?? null,
    is_published:
      typeof payload.is_published === "boolean" ? payload.is_published : false,
  };

  const res = await http<ToTMetaDTO | { data?: ToTMetaDTO }>(
    `${ADMIN_API_BASE}/api/tot-meta`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<ToTMetaDTO>(res);
}

export async function adminUpdateToTMeta(
  id: string,
  payload: Partial<ToTMetaDTO> & { ToT_id?: string }
): Promise<ToTMetaDTO> {
  const body: Record<string, unknown> = {};

  if (payload.ToT_id) body.ToT_id = payload.ToT_id;
  if (typeof payload.metafisika !== "undefined") body.metafisika = payload.metafisika;
  if (typeof payload.epsimologi !== "undefined") body.epsimologi = payload.epsimologi;
  if (typeof payload.aksiologi !== "undefined") body.aksiologi = payload.aksiologi;
  if (typeof payload.conclusion !== "undefined") body.conclusion = payload.conclusion;
  if (typeof payload.is_published === "boolean") body.is_published = payload.is_published;

  const res = await http<ToTMetaDTO | { data?: ToTMetaDTO }>(
    `${ADMIN_API_BASE}/api/tot-meta/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<ToTMetaDTO>(res);
}

export async function adminDeleteToTMeta(id: string): Promise<void> {
  await http<void | { data?: unknown }>(
    `${ADMIN_API_BASE}/api/tot-meta/${id}`,
    {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    }
  );
}

/* =============================================================================
   PUBLIC CONTENT API (GET/LIST/READ) - (tetap, tapi list normalizer sudah kuat)
============================================================================= */

type CacheEntry = {
  key: string;
  expiry: number;
  promise: Promise<any>;
  controller?: AbortController;
  refCount: number;
  done: boolean;
};

const GET_CACHE = new Map<string, CacheEntry>();

function sleep(ms: number, signal?: AbortSignal) {
  if (!signal) return new Promise((r) => setTimeout(r, ms));

  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const t = window.setTimeout(() => {
      cleanup();
      resolve();
    }, ms);

    const onAbort = () => {
      cleanup();
      try {
        window.clearTimeout(t);
      } catch {}
      reject(new DOMException("Aborted", "AbortError"));
    };

    const cleanup = () => {
      signal.removeEventListener("abort", onAbort);
    };

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function parseRetryAfterMs(res: Response): number | null {
  const ra = res.headers.get("Retry-After");
  if (!ra) return null;

  const asNum = Number(ra);
  if (!Number.isNaN(asNum) && asNum >= 0) return Math.floor(asNum * 1000);

  const asDate = Date.parse(ra);
  if (!Number.isNaN(asDate)) {
    const diff = asDate - Date.now();
    return diff > 0 ? diff : 0;
  }

  return null;
}

function makeAbortPromise(signal?: AbortSignal): Promise<never> | null {
  if (!signal) return null;

  if (signal.aborted) {
    return Promise.reject(new DOMException("Aborted", "AbortError"));
  }

  return new Promise((_, rej) => {
    signal.addEventListener(
      "abort",
      () => rej(new DOMException("Aborted", "AbortError")),
      { once: true }
    );
  });
}

function attachCacheConsumer<T>(entry: CacheEntry, signal?: AbortSignal): Promise<T> {
  entry.refCount += 1;

  let released = false;
  const release = () => {
    if (released) return;
    released = true;

    entry.refCount = Math.max(0, entry.refCount - 1);

    if (entry.refCount === 0 && entry.controller && !entry.done) {
      try {
        entry.controller.abort();
      } catch {}

      GET_CACHE.delete(entry.key);
    }
  };

  const abortP = makeAbortPromise(signal);

  const combined = abortP
    ? (Promise.race([entry.promise as Promise<T>, abortP]) as Promise<T>)
    : (entry.promise as Promise<T>);

  return combined.finally(release);
}

async function getJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  const TTL_MS = 15_000;
  const now = Date.now();

  let entry = GET_CACHE.get(url);

  if (!entry || entry.expiry <= now) {
    const ctrl = new AbortController();

    const exec = (async () => {
      const max429Retry = 1;
      let attempt = 0;

      while (true) {
        if (ctrl.signal.aborted) {
          throw new DOMException("Aborted", "AbortError");
        }

        const res = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "omit",
          signal: ctrl.signal,
        });

        if (res.ok) return (await res.json()) as T;

        if (res.status === 429 && attempt < max429Retry) {
          attempt += 1;
          const retryMs = parseRetryAfterMs(res) ?? 1500;
          const jitter = Math.floor(Math.random() * 250);
          await sleep(retryMs + jitter, ctrl.signal);
          continue;
        }

        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text}`);
      }
    })();

    entry = {
      key: url,
      expiry: now + TTL_MS,
      promise: exec,
      controller: ctrl,
      refCount: 0,
      done: false,
    };

    GET_CACHE.set(url, entry);

    exec
      .finally(() => {
        const cur = GET_CACHE.get(url);
        if (cur?.promise === exec) {
          cur.done = true;
        }
      })
      .catch(() => {});
  }

  try {
    return await attachCacheConsumer<T>(entry, signal);
  } catch (e: any) {
    const isCallerAbort = !!signal?.aborted && e?.name === "AbortError";

    const cur = GET_CACHE.get(url);
    if (cur?.promise === entry.promise && !isCallerAbort) {
      GET_CACHE.delete(url);
    }

    throw e;
  }
}

function isAbortSignal(x: unknown): x is AbortSignal {
  return !!x && typeof x === "object" && "aborted" in (x as any);
}

function isPublishedFlag(value: unknown): boolean {
  if (value === true) return true;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "1" || v === "true" || v === "yes";
  }
  return false;
}

function isShopPublishedLike(item: any): boolean {
  const raw = item?.is_published;
  if (typeof raw !== "undefined" && raw !== null) return isPublishedFlag(raw);
  return (
    item?.is_available === true ||
    item?.is_available === 1 ||
    item?.is_available === "true"
  );
}

export function normalizeBackendHtml(raw: string | null | undefined): string {
  if (!raw) return "";

  let html = String(raw).replace(/\\n/g, "\n").replace(/\\t/g, "\t");

  const useDecode = (s: string) =>
    s.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );

  html = useDecode(useDecode(html));

  const decodeHtmlEntitiesSafely = (s: string) => {
    if (typeof window === "undefined") return s;
    if (!s.includes("&")) return s;

    return s.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, (ent) => {
      const ta = document.createElement("textarea");
      ta.innerHTML = ent;
      return ta.value;
    });
  };

  html = decodeHtmlEntitiesSafely(decodeHtmlEntitiesSafely(html));

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  function repairLists(doc2: Document) {
    const lists = Array.from(doc2.querySelectorAll("ol, ul"));

    for (const list of lists) {
      const children = Array.from(list.childNodes);

      for (const child of children) {
        if (child.nodeType === Node.TEXT_NODE && !(child.textContent ?? "").trim()) {
          child.remove();
          continue;
        }

        const isLi =
          child.nodeType === Node.ELEMENT_NODE &&
          (child as HTMLElement).tagName.toLowerCase() === "li";
        if (isLi) continue;

        const li = doc2.createElement("li");
        list.insertBefore(li, child);
        li.appendChild(child);
      }
    }
  }

  repairLists(doc);

  const body = doc.body || doc.getElementsByTagName("body")[0];
  if (!body) return html.trim();

  const allowedTags = new Set<string>([
    "body",
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "span",
    "blockquote",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "img",
    "a",
    "figure",
    "figcaption",
    "code",
    "pre",
    "sup",
    "sub",
    "hr",
  ]);

  const unwrapTags = new Set<string>([
    "div",
    "section",
    "article",
    "header",
    "footer",
    "main",
    "aside",
    "nav",
  ]);

  const forbiddenTags = new Set<string>([
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "link",
    "meta",
  ]);

  const allowedAttrsByTag: Record<string, Set<string>> = {
    a: new Set(["href", "title", "target", "rel"]),
    img: new Set(["src", "alt", "title", "loading"]),
    table: new Set(["border", "cellpadding", "cellspacing"]),
    th: new Set(["colspan", "rowspan", "scope"]),
    td: new Set(["colspan", "rowspan"]),
    span: new Set(["class"]),
    i: new Set(["class"]),
    em: new Set(["class"]),
    strong: new Set(["class"]),
  };

  function replaceTag(el: HTMLElement, newTag: string): HTMLElement {
    const next = doc.createElement(newTag);
    Array.from(el.attributes).forEach((a) => next.setAttribute(a.name, a.value));
    while (el.firstChild) next.appendChild(el.firstChild);
    el.parentNode?.replaceChild(next, el);
    return next;
  }

  function replaceSpanStyleToSemantic(el: HTMLElement): HTMLElement | null {
    const style = el.getAttribute("style") ?? "";
    if (!style) return null;

    const italic = /font-style\s*:\s*italic/i.test(style);
    const bold = /font-weight\s*:\s*(bold|[6-9]00)/i.test(style);

    if (!italic && !bold) return null;

    if (italic && bold) {
      const strong = doc.createElement("strong");
      const em = doc.createElement("em");

      while (el.firstChild) em.appendChild(el.firstChild);
      strong.appendChild(em);

      el.parentNode?.replaceChild(strong, el);
      return strong;
    }

    const next = replaceTag(el, bold ? "strong" : "em");
    return next;
  }

  function sanitizeNode(node: Node | null): void {
    if (!node) return;

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      if (forbiddenTags.has(tag)) {
        el.remove();
        return;
      }

      if (tag === "span") {
        const replaced = replaceSpanStyleToSemantic(el);
        if (replaced) {
          sanitizeNode(replaced);
          return;
        }
      }

      if (tag === "i") {
        const emEl = replaceTag(el, "em");
        sanitizeNode(emEl);
        return;
      }

      if (tag === "b") {
        const strongEl = replaceTag(el, "strong");
        sanitizeNode(strongEl);
        return;
      }

      if (unwrapTags.has(tag) && !allowedTags.has(tag)) {
        const parent = el.parentNode;
        while (el.firstChild) parent?.insertBefore(el.firstChild, el);
        el.remove();
        return;
      }

      if (!allowedTags.has(tag)) {
        const parent = el.parentNode;
        while (el.firstChild) parent?.insertBefore(el.firstChild, el);
        el.remove();
        return;
      }

      if (tag === "em") {
        if (!el.classList.contains("italic")) el.classList.add("italic");
      }

      const allowedAttrs = allowedAttrsByTag[tag] ?? new Set<string>();
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();

        if (name.startsWith("on")) {
          el.removeAttribute(attr.name);
          return;
        }

        if (name === "style") {
          el.removeAttribute(attr.name);
          return;
        }

        if (!allowedAttrs.has(name)) {
          el.removeAttribute(attr.name);
          return;
        }

        if (tag === "a" && name === "href") {
          const href = el.getAttribute("href") ?? "";
          if (/^javascript:/i.test(href)) {
            el.removeAttribute("href");
          } else {
            if (
              !/^https?:/i.test(href) &&
              !/^mailto:/i.test(href) &&
              !/^#/i.test(href) &&
              !/^\//.test(href)
            ) {
              el.setAttribute("href", "#");
            }
            const rel = el.getAttribute("rel") ?? "";
            el.setAttribute("rel", (rel + " noopener noreferrer").trim());
          }
        }
      });
    }

    let child = node.firstChild;
    while (child) {
      const next = child.nextSibling;
      sanitizeNode(child);
      child = next;
    }
  }

  sanitizeNode(body);
  return body.innerHTML.trim();
}

async function getPublicList<T>(
  path: string,
  opts?: {
    signal?: AbortSignal;
    page?: number;
    limit?: number;
    publishedOnly?: boolean;
    publishFilter?: (item: any) => boolean;
  }
): Promise<ListResponse<T>> {
  const { signal, page, limit, publishedOnly, publishFilter } = opts ?? {};
  const baseUrl = `${API_BASE}${path}`;
  const url = buildUrlWithPagination(baseUrl, { page, limit });

  const payload = await getJSON<unknown>(url, signal);
  const normalized = normalizeListResponse<T>(payload);

  const data =
    publishedOnly
      ? normalized.data.filter((item) =>
          publishFilter
            ? publishFilter(item as any)
            : isPublishedFlag((item as any)?.is_published)
        )
      : normalized.data;

  return { ...normalized, data };
}

async function fetchAllPublicPages<T>(
  path: string,
  opts?: {
    signal?: AbortSignal;
    limit?: number;
    publishedOnly?: boolean;
    hardCapPages?: number;
    publishFilter?: (item: any) => boolean;
  }
): Promise<T[]> {
  const signal = opts?.signal;
  const limit = typeof opts?.limit === "number" && opts.limit > 0 ? opts.limit : 50;
  const publishedOnly =
    typeof opts?.publishedOnly === "boolean" ? opts.publishedOnly : true;
  const hardCapPages =
    typeof opts?.hardCapPages === "number" && opts.hardCapPages > 0
      ? opts.hardCapPages
      : 50;

  const all: T[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    if (page > hardCapPages) break;

    const res = await getPublicList<T>(path, {
      signal,
      page,
      limit,
      publishedOnly,
      publishFilter: opts?.publishFilter,
    });

    all.push(...res.data);

    const pg = res.pagination;
    if (!pg) {
      hasNext = false;
    } else {
      hasNext = pg.hasNextPage && page < (pg.totalPages ?? page);
    }

    if (hasNext) page += 1;
  }

  return all;
}

export const contentApi = {
  magazines: {
    async listPaginated(opts?: { signal?: AbortSignal; page?: number; limit?: number }): Promise<ListResponse<MagazineDTO>> {
      return getPublicList<MagazineDTO>("/api/megazine", {
        signal: opts?.signal,
        page: opts?.page,
        limit: opts?.limit,
        publishedOnly: true,
      });
    },

    async list(arg?: AbortSignal | { signal?: AbortSignal; page?: number; limit?: number }): Promise<MagazineDTO[]> {
      const signal = isAbortSignal(arg) ? arg : arg?.signal;
      const isObj = arg && typeof arg === "object" && !isAbortSignal(arg);
      const page = isObj ? (arg as any).page : undefined;
      const limit = isObj ? (arg as any).limit : undefined;

      if (typeof page === "number" && page > 0) {
        const res = await getPublicList<MagazineDTO>("/api/megazine", {
          signal,
          page,
          limit,
          publishedOnly: true,
        });
        return res.data;
      }

      return fetchAllPublicPages<MagazineDTO>("/api/megazine", {
        signal,
        limit,
        publishedOnly: true,
        hardCapPages: 50,
      });
    },
  },

  research: {
    async listPaginated(opts?: { signal?: AbortSignal; page?: number; limit?: number }): Promise<ListResponse<ResearchDTO>> {
      return getPublicList<ResearchDTO>("/api/research", {
        signal: opts?.signal,
        page: opts?.page,
        limit: opts?.limit,
        publishedOnly: true,
      });
    },

    async list(arg?: AbortSignal | { signal?: AbortSignal; page?: number; limit?: number }): Promise<ResearchDTO[]> {
      const signal = isAbortSignal(arg) ? arg : arg?.signal;
      const isObj = arg && typeof arg === "object" && !isAbortSignal(arg);
      const page = isObj ? (arg as any).page : undefined;
      const limit = isObj ? (arg as any).limit : undefined;

      if (typeof page === "number" && page > 0) {
        const res = await getPublicList<ResearchDTO>("/api/research", {
          signal,
          page,
          limit,
          publishedOnly: true,
        });
        return res.data;
      }

      return fetchAllPublicPages<ResearchDTO>("/api/research", {
        signal,
        limit,
        publishedOnly: true,
        hardCapPages: 50,
      });
    },
  },

  monologues: {
    async listPaginated(opts?: { signal?: AbortSignal; page?: number; limit?: number }): Promise<ListResponse<MonologueDTO>> {
      return getPublicList<MonologueDTO>("/api/monologues", {
        signal: opts?.signal,
        page: opts?.page,
        limit: opts?.limit,
        publishedOnly: true,
      });
    },

    async list(arg?: AbortSignal | { signal?: AbortSignal; page?: number; limit?: number }): Promise<MonologueDTO[]> {
      const signal = isAbortSignal(arg) ? arg : arg?.signal;
      const isObj = arg && typeof arg === "object" && !isAbortSignal(arg);
      const page = isObj ? (arg as any).page : undefined;
      const limit = isObj ? (arg as any).limit : undefined;

      if (typeof page === "number" && page > 0) {
        const res = await getPublicList<MonologueDTO>("/api/monologues", {
          signal,
          page,
          limit,
          publishedOnly: true,
        });
        return res.data;
      }

      return fetchAllPublicPages<MonologueDTO>("/api/monologues", {
        signal,
        limit,
        publishedOnly: true,
        hardCapPages: 50,
      });
    },
  },

  articles: {
    async listPaginated(
      arg?:
        | AbortSignal
        | {
            category?: ArticleCategory;
            signal?: AbortSignal;
            page?: number;
            limit?: number;
          }
    ): Promise<ListResponse<ArticleDTO>> {
      const isObj = arg && typeof arg === "object" && !isAbortSignal(arg);
      const category = isObj ? (arg as any).category : undefined;
      const signal = isObj ? (arg as any).signal : isAbortSignal(arg) ? (arg as AbortSignal) : undefined;
      const page = isObj ? (arg as any).page : undefined;
      const limit = isObj ? (arg as any).limit : undefined;

      const res = await getPublicList<ArticleDTO>("/api/articel", {
        signal,
        page,
        limit,
        publishedOnly: true,
      });

      if (category) {
        const target = String(category).toUpperCase();
        const filtered = res.data.filter((x) => (x.category ?? "").toUpperCase() === target);
        return { ...res, data: filtered };
      }

      return res;
    },

    async list(
      arg?:
        | AbortSignal
        | {
            category?: ArticleCategory;
            signal?: AbortSignal;
            page?: number;
            limit?: number;
          }
    ): Promise<ArticleDTO[]> {
      const isObj = arg && typeof arg === "object" && !isAbortSignal(arg);
      const category = isObj ? (arg as any).category : undefined;
      const signal = isObj ? (arg as any).signal : isAbortSignal(arg) ? (arg as AbortSignal) : undefined;
      const page = isObj ? (arg as any).page : undefined;
      const limit = isObj ? (arg as any).limit : undefined;

      if (typeof page === "number" && page > 0) {
        const res = await getPublicList<ArticleDTO>("/api/articel", {
          signal,
          page,
          limit,
          publishedOnly: true,
        });

        if (category) {
          const target = String(category).toUpperCase();
          return res.data.filter((x) => (x.category ?? "").toUpperCase() === target);
        }

        return res.data;
      }

      const all = await fetchAllPublicPages<ArticleDTO>("/api/articel", {
        signal,
        limit,
        publishedOnly: true,
        hardCapPages: 50,
      });

      if (category) {
        const target = String(category).toUpperCase();
        return all.filter((x) => (x.category ?? "").toUpperCase() === target);
      }

      return all;
    },

    async detailBySlug(
      slug: string,
      opts?: { category?: ArticleCategory; signal?: AbortSignal }
    ): Promise<ArticleDTO | null> {
      const { category, signal } = opts ?? {};
      const norm = (s: string) => (s ?? "").trim().toLowerCase();

      try {
        const url = `${API_BASE}/api/articel/title/${encodeURIComponent(slug)}`;
        const res = await getJSON<any>(url, signal);

        const article: ArticleDTO | null =
          res?.data && !Array.isArray(res.data) ? (res.data as ArticleDTO) :
          res && !Array.isArray(res) ? (res as ArticleDTO) :
          null;

        if (article && isPublishedFlag((article as any)?.is_published)) {
          if (!category) return article;

          const target = String(category).toUpperCase();
          if (String(article.category ?? "").toUpperCase() === target) return article;

          return null;
        }
      } catch {}

      const PAGE_LIMIT = 100;
      const MAX_PAGES_SCAN = 10;

      for (let page = 1; page <= MAX_PAGES_SCAN; page += 1) {
        const res = await contentApi.articles.listPaginated({
          category,
          signal,
          page,
          limit: PAGE_LIMIT,
        });

        const found = res.data.find((a) => norm(a.slug) === norm(slug));
        if (found) return found;

        const pg = res.pagination;
        if (!pg || !pg.hasNextPage || page >= (pg.totalPages ?? page)) break;
      }

      return null;
    },
  },

  shops: {
    async listPaginated(opts?: { signal?: AbortSignal; page?: number; limit?: number }): Promise<ListResponse<ShopDTO>> {
      return getPublicList<ShopDTO>("/api/shop", {
        signal: opts?.signal,
        page: opts?.page,
        limit: opts?.limit,
        publishedOnly: true,
        publishFilter: isShopPublishedLike,
      });
    },

    async list(arg?: AbortSignal | { signal?: AbortSignal; page?: number; limit?: number }): Promise<ShopDTO[]> {
      const signal = isAbortSignal(arg) ? arg : arg?.signal;
      const isObj = arg && typeof arg === "object" && !isAbortSignal(arg);
      const page = isObj ? (arg as any).page : undefined;
      const limit = isObj ? (arg as any).limit : undefined;

      if (typeof page === "number" && page > 0) {
        const res = await getPublicList<ShopDTO>("/api/shop", {
          signal,
          page,
          limit,
          publishedOnly: true,
          publishFilter: isShopPublishedLike,
        });
        return res.data;
      }

      return fetchAllPublicPages<ShopDTO>("/api/shop", {
        signal,
        limit,
        publishedOnly: true,
        hardCapPages: 50,
        publishFilter: isShopPublishedLike,
      });
    },
  },

  tot: {
    async listPaginated(opts?: { signal?: AbortSignal; page?: number; limit?: number }): Promise<ListResponse<ToTDTO>> {
      return getPublicList<ToTDTO>("/api/ToT", {
        signal: opts?.signal,
        page: opts?.page,
        limit: opts?.limit,
        publishedOnly: true,
      });
    },

    async list(arg?: AbortSignal | { signal?: AbortSignal; page?: number; limit?: number }): Promise<ToTDTO[]> {
      const signal = isAbortSignal(arg) ? arg : arg?.signal;
      const isObj = arg && typeof arg === "object" && !isAbortSignal(arg);
      const page = isObj ? (arg as any).page : undefined;
      const limit = isObj ? (arg as any).limit : undefined;

      if (typeof page === "number" && page > 0) {
        const res = await getPublicList<ToTDTO>("/api/ToT", {
          signal,
          page,
          limit,
          publishedOnly: true,
        });
        return res.data;
      }

      return fetchAllPublicPages<ToTDTO>("/api/ToT", {
        signal,
        limit: typeof limit === "number" && limit > 0 ? limit : 100,
        publishedOnly: true,
        hardCapPages: 50,
      });
    },
  },

  totMeta: {
    async byTotId(totId: string, signal?: AbortSignal): Promise<ToTMetaDTO | null> {
      const url = `${API_BASE}/api/tot-meta/tot/${encodeURIComponent(totId)}`;
      const any = await getJSON<any>(url, signal);

      let meta: ToTMetaDTO | null = null;

      if (any?.data && !Array.isArray(any.data)) {
        meta = any.data as ToTMetaDTO;
      } else if (Array.isArray(any?.data)) {
        const list = any.data as ToTMetaDTO[];
        meta = list.find((m) => isPublishedFlag((m as any)?.is_published)) ?? null;
      } else {
        meta = (any as ToTMetaDTO) ?? null;
      }

      if (!meta || !isPublishedFlag((meta as any).is_published)) {
        return null;
      }

      return meta;
    },
  },

  youtube: {
    async latest(signal?: AbortSignal): Promise<LatestYoutubeDTO[]> {
      const url = `${API_BASE}/api/youtube/latest`;
      const res = await getJSON<{ data?: LatestYoutubeDTO[] }>(url, signal);
      return Array.isArray(res?.data) ? res.data : [];
    },
  },
};

export type DetailResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export function useArticleDetail(slug: string, opts?: { category?: ArticleCategory }) {
  const [data, setData] = useState<ArticleDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setData(null);
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    contentApi.articles
      .detailBySlug(slug, { category: opts?.category, signal: ctrl.signal })
      .then((res) => setData(res))
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setError(err?.message ?? "Failed to load");
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [slug, opts?.category]);

  return { data, loading, error };
}

export default contentApi;