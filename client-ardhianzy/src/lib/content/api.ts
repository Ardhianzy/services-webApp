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
  LatestYoutubeDTO,
} from "./types";

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
      return unwrapList<MagazineDTO>(payload);
    },
  },

  research: {
    async list(signal?: AbortSignal): Promise<ResearchDTO[]> {
      const url = `${API_BASE}/api/research`;
      const payload = await getJSON<ListResponse<ResearchDTO>>(url, signal);
      return unwrapList<ResearchDTO>(payload);
    },
  },

  monologues: {
    async list(signal?: AbortSignal): Promise<MonologueDTO[]> {
      const url = `${API_BASE}/api/monologues`;
      const payload = await getJSON<ListResponse<MonologueDTO>>(url, signal);
      return unwrapList<MonologueDTO>(payload);
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

      if (category) {
        const target = String(category).toUpperCase();
        return list.filter((x) => (x.category ?? "").toUpperCase() === target);
      }
      return list;
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
      return Array.isArray(json?.data) ? (json.data as ShopDTO[]) : [];
    },
  },

  tot: {
    async list(signal?: AbortSignal): Promise<ToTDTO[]> {
      const url = `${API_BASE}/api/tot`;
      const payload = await getJSON<ListResponse<ToTDTO>>(url, signal);
      return Array.isArray(payload?.data) ? payload.data : [];
    },
  },
  totMeta: {
    async byTotId(totId: string, signal?: AbortSignal): Promise<ToTMetaDTO | null> {
      const url = `${API_BASE}/api/tot-meta/tot/${encodeURIComponent(totId)}`;
      const any = await getJSON<any>(url, signal);
      if (any?.data && !Array.isArray(any.data)) return any.data as ToTMetaDTO;
      if (Array.isArray(any?.data)) return (any.data as ToTMetaDTO[])[0] ?? null;
      return (any as ToTMetaDTO) ?? null;
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

export type ToTMetaDTO = {
  id: string;
  ToT_id: string;
  metafisika?: string | null;
  epsimologi?: string | null;
  aksiologi?: string | null;
  conclusion?: string | null;
  tot?: Partial<ToTDTO> | null;
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