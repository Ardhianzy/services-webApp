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
} from "./types";
import { http, authHeader } from "@/lib/http";

const ADMIN_API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "";

function unwrapAdminDetail<T>(payload: T | { data?: T }): T {
  if ((payload as any)?.data !== undefined) {
    return (payload as any).data as T;
  }
  return payload as T;
}

/* ========== ADMIN: ARTICLES ========== */

export async function adminFetchArticles(): Promise<ArticleDTO[]> {
  const res = await http<ArticleDTO[] | { data?: ArticleDTO[] }>(
    `${ADMIN_API_BASE}/api/articel`,
    {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    }
  );

  if (Array.isArray(res)) return res;
  if (Array.isArray((res as any).data)) {
    return (res as any).data as ArticleDTO[];
  }
  return [];
}

// FIX: backend tidak punya GET /api/articel/:id → ambil dari list lalu filter
export async function adminGetArticleById(id: string): Promise<ArticleDTO> {
  const list = await adminFetchArticles();
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

export async function adminFetchMagazines(): Promise<MagazineDTO[]> {
  const res = await http<MagazineDTO[] | { data?: MagazineDTO[] }>(
    `${ADMIN_API_BASE}/api/megazine`,
    {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    }
  );

  if (Array.isArray(res)) return res;
  if (Array.isArray((res as any).data)) {
    return (res as any).data as MagazineDTO[];
  }
  return [];
}

// FIX: backend biasanya hanya punya GET /api/megazine (list) + PUT /api/megazine/:id
export async function adminGetMagazineById(id: string): Promise<MagazineDTO> {
  const list = await adminFetchMagazines();
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

export async function adminFetchMonologues(): Promise<MonologueDTO[]> {
  const res = await http<MonologueDTO[] | { data?: MonologueDTO[] }>(
    `${ADMIN_API_BASE}/api/monologues`,
    {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    }
  );

  if (Array.isArray(res)) return res;
  if (Array.isArray((res as any).data)) {
    return (res as any).data as MonologueDTO[];
  }
  return [];
}

// FIX: backend punya GET /api/monologues (list) + PUT/DELETE /api/monologues/:id
export async function adminGetMonologueById(
  id: string
): Promise<MonologueDTO> {
  const list = await adminFetchMonologues();
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

export async function adminFetchResearch(): Promise<ResearchDTO[]> {
  const res = await http<ResearchDTO[] | { data?: ResearchDTO[] }>(
    `${ADMIN_API_BASE}/api/research`,
    {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    }
  );

  if (Array.isArray(res)) return res;
  if (Array.isArray((res as any).data)) {
    return (res as any).data as ResearchDTO[];
  }
  return [];
}

// FIX: YAML/Insomnia hanya sebut GET /api/research (list) untuk fetch
export async function adminGetResearchById(id: string): Promise<ResearchDTO> {
  const list = await adminFetchResearch();
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

export async function adminFetchShops(): Promise<ShopDTO[]> {
  const res = await http<ShopDTO[] | { data?: ShopDTO[] }>(
    `${ADMIN_API_BASE}/api/shop`,
    {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    }
  );

  if (Array.isArray(res)) return res;
  if (Array.isArray((res as any).data)) {
    return (res as any).data as ShopDTO[];
  }
  return [];
}

// FIX: backend pakai GET /api/shop (list) + PUT/DELETE /api/shop/:id
export async function adminGetShopById(id: string): Promise<ShopDTO> {
  const list = await adminFetchShops();
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

export async function adminFetchToT(): Promise<ToTDTO[]> {
  const res = await http<ToTDTO[] | { data?: ToTDTO[] }>(
    `${ADMIN_API_BASE}/api/tot`,
    {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    }
  );

  if (Array.isArray(res)) return res;
  if (Array.isArray((res as any).data)) {
    return (res as any).data as ToTDTO[];
  }
  return [];
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

export async function adminFetchToTMeta(): Promise<ToTMetaDTO[]> {
  const res = await http<ToTMetaDTO[] | { data?: ToTMetaDTO[] }>(
    `${ADMIN_API_BASE}/api/tot-meta`,
    {
      method: "GET",
      headers: {
        ...authHeader(),
      },
    }
  );

  if (Array.isArray(res)) return res;
  if (Array.isArray((res as any).data)) {
    return (res as any).data as ToTMetaDTO[];
  }
  return [];
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
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

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

function unwrapList<T>(payload: ListResponse<T>): T[] {
  if (Array.isArray(payload)) return payload as T[];
  const anyPayload = payload as any;
  if (anyPayload?.data && Array.isArray(anyPayload.data)) {
    return anyPayload.data as T[];
  }
  return [];
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

export const contentApi = {
  magazines: {
    async list(signal?: AbortSignal): Promise<MagazineDTO[]> {
      const url = `${API_BASE}/api/megazine`;
      const payload = await getJSON<ListResponse<MagazineDTO>>(url, signal);
      const list = unwrapList<MagazineDTO>(payload);

      return list.filter((mag) => isPublishedFlag((mag as any)?.is_published));
    },
  },

  research: {
    async list(signal?: AbortSignal): Promise<ResearchDTO[]> {
      const url = `${API_BASE}/api/research`;
      const payload = await getJSON<ListResponse<ResearchDTO>>(url, signal);
      const list = unwrapList<ResearchDTO>(payload);

      return list.filter((mag) => isPublishedFlag((mag as any)?.is_published));
    },
  },

  monologues: {
    async list(signal?: AbortSignal): Promise<MonologueDTO[]> {
      const url = `${API_BASE}/api/monologues`;
      const payload = await getJSON<ListResponse<MonologueDTO>>(url, signal);
      const list = unwrapList<MonologueDTO>(payload);

      return list.filter((mag) => isPublishedFlag((mag as any)?.is_published));
    },
  },

  articles: {
    async list(
      arg?: AbortSignal | { category?: ArticleCategory; signal?: AbortSignal }
    ): Promise<ArticleDTO[]> {
      const category =
        arg && typeof arg === "object" && !isAbortSignal(arg)
          ? arg.category
          : undefined;
      const signal =
        (arg && typeof arg === "object" && !isAbortSignal(arg)
          ? arg.signal
          : undefined) ?? (isAbortSignal(arg) ? arg : undefined);

      const url = `${API_BASE}/api/articel`;
      const payload = await getJSON<ListResponse<ArticleDTO>>(url, signal);
      const list = unwrapList<ArticleDTO>(payload);

      const published = list.filter((item) =>
        isPublishedFlag((item as any)?.is_published)
      );

      if (category) {
        const target = String(category).toUpperCase();
        return published.filter(
          (x) => (x.category ?? "").toUpperCase() === target
        );
      }

      return published;
    },

    async detailBySlug(
      slug: string,
      opts?: { category?: ArticleCategory; signal?: AbortSignal }
    ): Promise<ArticleDTO | null> {
      const { category, signal } = opts ?? {};
      const list = await contentApi.articles.list({ category, signal });
      const norm = (s: string) => s?.trim().toLowerCase();
      const found = list.find((a) => norm(a.slug) === norm(slug));
      return found ?? null;
    },
  },

  shops: {
    async list(): Promise<ShopDTO[]> {
      const url = `${API_BASE}/api/shop`;
      const res = await fetch(url, { method: "GET" });
      if (!res.ok) throw new Error(`Failed to fetch shops (${res.status})`);

      const json = await res.json();
      const rawList: ShopDTO[] = Array.isArray(json?.data)
        ? (json.data as ShopDTO[])
        : [];

      return rawList.filter((item) =>
        isPublishedFlag((item as any)?.is_published)
      );
    },
  },

  tot: {
    async list(signal?: AbortSignal): Promise<ToTDTO[]> {
      const url = `${API_BASE}/api/tot`;
      const payload = await getJSON<ListResponse<ToTDTO>>(url, signal);

      const rawList: ToTDTO[] = Array.isArray((payload as any)?.data)
        ? ((payload as any).data as ToTDTO[])
        : Array.isArray(payload)
        ? (payload as unknown as ToTDTO[])
        : [];

      return rawList.filter((item) => isPublishedFlag((item as any)?.is_published));
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