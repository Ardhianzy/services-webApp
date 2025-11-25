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

const ADMIN_API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "";

type PageParams = {
  page?: number;
  limit?: number;
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

function ensurePagination<T>(
  data: T[],
  pagination?: Pagination
): Pagination {
  if (pagination) return pagination;

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

function normalizeListResponse<T>(
  raw:
    | ListResponse<T>
    | T[]
    | { data?: T[]; pagination?: Pagination; success?: boolean; message?: string }
    | unknown
): ListResponse<T> {
  const anyRaw: any = raw as any;

  if (Array.isArray(raw)) {
    const arr = raw as T[];
    return {
      success: true,
      data: arr,
      pagination: ensurePagination(arr),
    };
  }

  if (anyRaw && Array.isArray(anyRaw.data)) {
    const arr = anyRaw.data as T[];
    return {
      success:
        typeof anyRaw.success === "boolean" ? anyRaw.success : true,
      message: anyRaw.message,
      data: arr,
      pagination: ensurePagination(arr, anyRaw.pagination),
    };
  }

  return {
    success:
      typeof anyRaw?.success === "boolean" ? anyRaw.success : true,
    message: anyRaw?.message,
    data: [],
    pagination: ensurePagination([]),
  };
}

async function adminGetList<T>(
  path: string,
  params?: PageParams
): Promise<ListResponse<T>> {
  const baseUrl = `${ADMIN_API_BASE}${path}`;
  const url = buildUrlWithPagination(baseUrl, params);

  const res = await http<
    ListResponse<T> | T[] | { data?: T[]; pagination?: Pagination; success?: boolean; message?: string }
  >(url, {
    method: "GET",
    headers: {
      ...authHeader(),
    },
  });

  return normalizeListResponse<T>(res);
}

function unwrapAdminDetail<T>(payload: T | { data?: T }): T {
  if ((payload as any)?.data !== undefined) {
    return (payload as any).data as T;
  }
  return payload as T;
}

/* ========== ADMIN: ARTICLES ========== */

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

export async function adminGetArticleById(id: string): Promise<ArticleDTO> {
  const list = await adminFetchArticles({ page: 1, limit: 1000 });
  const found = list.find((item) => String(item.id) === String(id));
  if (!found) {
    throw new Error("Artikel tidak ditemukan.");
  }
  return found;
}

export async function adminCreateArticle(
  formData: FormData
): Promise<ArticleDTO> {
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
  await http<void | { data?: unknown }>(
    `${ADMIN_API_BASE}/api/articel/${id}`,
    {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    }
  );
}

/* ========== ADMIN: MAGAZINES ========== */

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

export async function adminGetMagazineById(id: string): Promise<MagazineDTO> {
  const list = await adminFetchMagazines({ page: 1, limit: 1000 });
  const found = list.find((item) => String(item.id) === String(id));
  if (!found) {
    throw new Error("Magazine tidak ditemukan.");
  }
  return found;
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
  await http<void | { data?: unknown }>(
    `${ADMIN_API_BASE}/api/megazine/${id}`,
    {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    }
  );
}

/* ========== ADMIN: MONOLOGUES ========== */

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
  id: string
): Promise<MonologueDTO> {
  const list = await adminFetchMonologues({ page: 1, limit: 1000 });
  const found = list.find((item) => String(item.id) === String(id));
  if (!found) {
    throw new Error("Monologue tidak ditemukan.");
  }
  return found;
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

/* ========== ADMIN: RESEARCH ========== */

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

export async function adminGetResearchById(id: string): Promise<ResearchDTO> {
  const list = await adminFetchResearch({ page: 1, limit: 1000 });
  const found = list.find((item) => String(item.id) === String(id));
  if (!found) {
    throw new Error("Research tidak ditemukan.");
  }
  return found;
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

/* ========== ADMIN: SHOP ========== */

export async function adminFetchShopsPaginated(
  params?: PageParams
): Promise<ListResponse<ShopDTO>> {
  return adminGetList<ShopDTO>("/api/shop", params);
}

export async function adminFetchShops(
  params?: PageParams
): Promise<ShopDTO[]> {
  const res = await adminFetchShopsPaginated(params);
  return res.data;
}

export async function adminGetShopById(id: string): Promise<ShopDTO> {
  const list = await adminFetchShops({ page: 1, limit: 1000 });
  const found = list.find((item) => String(item.id) === String(id));
  if (!found) {
    throw new Error("Shop item tidak ditemukan.");
  }
  return found;
}

export async function adminCreateShop(
  formData: FormData
): Promise<ShopDTO> {
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
  await http<void | { data?: unknown }>(
    `${ADMIN_API_BASE}/api/shop/${id}`,
    {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    }
  );
}

/* ========== ADMIN: ToT (Timeline of Thought) ========== */

export async function adminFetchToTPaginated(
  params?: PageParams
): Promise<ListResponse<ToTDTO>> {
  return adminGetList<ToTDTO>("/api/tot", params);
}

export async function adminFetchToT(
  params?: PageParams
): Promise<ToTDTO[]> {
  const res = await adminFetchToTPaginated(params);
  return res.data;
}

export async function adminGetToTById(id: string): Promise<ToTDTO> {
  const res = await http<ToTDTO | { data?: ToTDTO }>(
    `${ADMIN_API_BASE}/api/tot/${id}`,
    {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<ToTDTO>(res);
}

export async function adminCreateToT(
  formData: FormData
): Promise<ToTDTO> {
  const res = await http<ToTDTO | { data?: ToTDTO }>(
    `${ADMIN_API_BASE}/api/tot`,
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
}

export async function adminDeleteToT(id: string): Promise<void> {
  await http<void | { data?: unknown }>(
    `${ADMIN_API_BASE}/api/tot/${id}`,
    {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    }
  );
}

/* ========== ADMIN: ToT Meta ========== */

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

export async function adminGetToTMetaById(id: string): Promise<ToTMetaDTO> {
  const res = await http<ToTMetaDTO | { data?: ToTMetaDTO }>(
    `${ADMIN_API_BASE}/api/tot-meta/${id}`,
    {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    }
  );
  return unwrapAdminDetail<ToTMetaDTO>(res);
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

/* ============================================================================
   PUBLIC CONTENT API
============================================================================ */

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ??
  "";

async function getJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "omit",
    signal,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text}`);
  }
  return (await res.json()) as T;
}

export function unwrapList<T>(payload: ListResponse<T> | T[] | unknown): T[] {
  return normalizeListResponse<T>(payload as any).data;
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

export function normalizeBackendHtml(input?: string | null): string {
  if (!input) return "";
  let html = String(input)
    .replace(/\\u003c/gi, "<")
    .replace(/\\u003e/gi, ">")
    .replace(/\\u0026/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&");
  html = html.replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
  html = html.replace(/\son\w+="[^"]*"/gi, "");
  return html;
}

async function getPublicList<T>(
  path: string,
  opts?: {
    signal?: AbortSignal;
    page?: number;
    limit?: number;
    publishedOnly?: boolean;
  }
): Promise<ListResponse<T>> {
  const { signal, page, limit, publishedOnly } = opts ?? {};
  const baseUrl = `${API_BASE}${path}`;
  const url = buildUrlWithPagination(baseUrl, { page, limit });

  const payload = await getJSON<unknown>(url, signal);
  const normalized = normalizeListResponse<T>(payload);

  const data = publishedOnly
    ? normalized.data.filter((item) =>
        isPublishedFlag((item as any)?.is_published)
      )
    : normalized.data;

  return {
    ...normalized,
    data,
  };
}

export const contentApi = {
  magazines: {
    async listPaginated(
      opts?: { signal?: AbortSignal; page?: number; limit?: number }
    ): Promise<ListResponse<MagazineDTO>> {
      return getPublicList<MagazineDTO>("/api/megazine", {
        signal: opts?.signal,
        page: opts?.page,
        limit: opts?.limit,
        publishedOnly: true,
      });
    },

    async list(
      arg?: AbortSignal | { signal?: AbortSignal; page?: number; limit?: number }
    ): Promise<MagazineDTO[]> {
      const signal = isAbortSignal(arg) ? arg : arg?.signal;
      const limit =
        !isAbortSignal(arg) &&
        typeof arg?.limit === "number" &&
        !Number.isNaN(arg.limit) &&
        arg.limit > 0
          ? arg.limit
          : 50;

      const all: MagazineDTO[] = [];
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const res = await getPublicList<MagazineDTO>("/api/megazine", {
          signal,
          page,
          limit,
          publishedOnly: true,
        });

        all.push(...res.data);

        const pg = res.pagination;
        if (!pg) {
          hasNext = false;
        } else {
          hasNext = pg.hasNextPage && page < (pg.totalPages ?? page);
        }

        if (hasNext) {
          page += 1;
        }
      }

      return all;
    },
  },

  research: {
    async listPaginated(
      opts?: { signal?: AbortSignal; page?: number; limit?: number }
    ): Promise<ListResponse<ResearchDTO>> {
      return getPublicList<ResearchDTO>("/api/research", {
        signal: opts?.signal,
        page: opts?.page,
        limit: opts?.limit,
        publishedOnly: true,
      });
    },

    async list(
      arg?: AbortSignal | { signal?: AbortSignal; page?: number; limit?: number }
    ): Promise<ResearchDTO[]> {
      const signal = isAbortSignal(arg) ? arg : arg?.signal;
      const limit =
        !isAbortSignal(arg) &&
        typeof arg?.limit === "number" &&
        !Number.isNaN(arg.limit) &&
        arg.limit > 0
          ? arg.limit
          : 50;

      const all: ResearchDTO[] = [];
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const res = await getPublicList<ResearchDTO>("/api/research", {
          signal,
          page,
          limit,
          publishedOnly: true,
        });

        all.push(...res.data);

        const pg = res.pagination;
        if (!pg) {
          hasNext = false;
        } else {
          hasNext = pg.hasNextPage && page < (pg.totalPages ?? page);
        }

        if (hasNext) {
          page += 1;
        }
      }

      return all;
    },
  },

  monologues: {
    async listPaginated(
      opts?: { signal?: AbortSignal; page?: number; limit?: number }
    ): Promise<ListResponse<MonologueDTO>> {
      return getPublicList<MonologueDTO>("/api/monologues", {
        signal: opts?.signal,
        page: opts?.page,
        limit: opts?.limit,
        publishedOnly: true,
      });
    },

    async list(
      arg?: AbortSignal | { signal?: AbortSignal; page?: number; limit?: number }
    ): Promise<MonologueDTO[]> {
      const signal = isAbortSignal(arg) ? arg : arg?.signal;
      const limit =
        !isAbortSignal(arg) &&
        typeof arg?.limit === "number" &&
        !Number.isNaN(arg.limit) &&
        arg.limit > 0
          ? arg.limit
          : 50;

      const all: MonologueDTO[] = [];
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const res = await getPublicList<MonologueDTO>("/api/monologues", {
          signal,
          page,
          limit,
          publishedOnly: true,
        });

        all.push(...res.data);

        const pg = res.pagination;
        if (!pg) {
          hasNext = false;
        } else {
          hasNext = pg.hasNextPage && page < (pg.totalPages ?? page);
        }

        if (hasNext) {
          page += 1;
        }
      }

      return all;
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
      const signal = isObj
        ? (arg as any).signal
        : isAbortSignal(arg)
        ? (arg as AbortSignal)
        : undefined;
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
        const filtered = res.data.filter(
          (x) => (x.category ?? "").toUpperCase() === target
        );
        return {
          ...res,
          data: filtered,
        };
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
      const signal = isObj
        ? (arg as any).signal
        : isAbortSignal(arg)
        ? (arg as AbortSignal)
        : undefined;

      const pageSize =
        isObj &&
        typeof (arg as any).limit === "number" &&
        !Number.isNaN((arg as any).limit) &&
        (arg as any).limit > 0
          ? (arg as any).limit
          : 50;

      const all: ArticleDTO[] = [];
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const res = await getPublicList<ArticleDTO>("/api/articel", {
          signal,
          page,
          limit: pageSize,
          publishedOnly: true,
        });

        let pageData = res.data;
        if (category) {
          const target = String(category).toUpperCase();
          pageData = pageData.filter(
            (x) => (x.category ?? "").toUpperCase() === target
          );
        }

        all.push(...pageData);

        const pg = res.pagination;
        if (!pg) {
          hasNext = false;
        } else {
          hasNext = pg.hasNextPage && page < (pg.totalPages ?? page);
        }

        if (hasNext) {
          page += 1;
        }
      }

      return all;
    },

    async detailBySlug(
      slug: string,
      opts?: { category?: ArticleCategory; signal?: AbortSignal }
    ): Promise<ArticleDTO | null> {
      const { category, signal } = opts ?? {};
      const list = await contentApi.articles.list({
        category,
        signal,
        page: 1,
        limit: 1000,
      });
      const norm = (s: string) => s?.trim().toLowerCase();
      const found = list.find((a) => norm(a.slug) === norm(slug));
      return found ?? null;
    },
  },

  shops: {
    async listPaginated(
      opts?: { signal?: AbortSignal; page?: number; limit?: number }
    ): Promise<ListResponse<ShopDTO>> {
      return getPublicList<ShopDTO>("/api/shop", {
        signal: opts?.signal,
        page: opts?.page,
        limit: opts?.limit,
        publishedOnly: true,
      });
    },

    async list(
      arg?: AbortSignal | { signal?: AbortSignal; page?: number; limit?: number }
    ): Promise<ShopDTO[]> {
      const signal = isAbortSignal(arg) ? arg : arg?.signal;
      const limit =
        !isAbortSignal(arg) &&
        typeof arg?.limit === "number" &&
        !Number.isNaN(arg.limit) &&
        arg.limit > 0
          ? arg.limit
          : 50;

      const all: ShopDTO[] = [];
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const res = await getPublicList<ShopDTO>("/api/shop", {
          signal,
          page,
          limit,
          publishedOnly: true,
        });

        all.push(...res.data);

        const pg = res.pagination;
        if (!pg) {
          hasNext = false;
        } else {
          hasNext = pg.hasNextPage && page < (pg.totalPages ?? page);
        }

        if (hasNext) {
          page += 1;
        }
      }

      return all;
    },
  },

  tot: {
    async listPaginated(
      opts?: { signal?: AbortSignal; page?: number; limit?: number }
    ): Promise<ListResponse<ToTDTO>> {
      return getPublicList<ToTDTO>("/api/tot", {
        signal: opts?.signal,
        page: opts?.page,
        limit: opts?.limit,
        publishedOnly: true,
      });
    },

    async list(
      arg?: AbortSignal | { signal?: AbortSignal; page?: number; limit?: number }
    ): Promise<ToTDTO[]> {
      const signal = isAbortSignal(arg) ? arg : arg?.signal;
      const limit =
        !isAbortSignal(arg) &&
        typeof arg?.limit === "number" &&
        !Number.isNaN(arg.limit) &&
        arg.limit > 0
          ? arg.limit
          : 100;

      const all: ToTDTO[] = [];
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const res = await getPublicList<ToTDTO>("/api/tot", {
          signal,
          page,
          limit,
          publishedOnly: true,
        });

        all.push(...res.data);

        const pg = res.pagination;
        if (!pg) {
          hasNext = false;
        } else {
          hasNext = pg.hasNextPage && page < (pg.totalPages ?? page);
        }

        if (hasNext) {
          page += 1;
        }
      }

      return all;
    },
  },

  totMeta: {
    async byTotId(
      totId: string,
      signal?: AbortSignal
    ): Promise<ToTMetaDTO | null> {
      const url = `${API_BASE}/api/tot-meta/tot/${encodeURIComponent(totId)}`;
      const any = await getJSON<any>(url, signal);

      let meta: ToTMetaDTO | null = null;

      if (any?.data && !Array.isArray(any.data)) {
        meta = any.data as ToTMetaDTO;
      } else if (Array.isArray(any?.data)) {
        const list = any.data as ToTMetaDTO[];
        meta =
          list.find((m) => isPublishedFlag((m as any)?.is_published)) ?? null;
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
      const url = `${import.meta.env.VITE_API_URL}/api/youtube/latest`;
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

export function useArticleDetail(
  slug: string,
  opts?: { category?: ArticleCategory }
) {
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
      .catch((err) => setError(err?.message ?? "Failed to load"))
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [slug, opts?.category]);

  return { data, loading, error };
}

export default contentApi;