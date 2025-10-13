// src/features/articles/hooks.ts
import { useEffect, useMemo, useState } from "react";
import { listArticles } from "@/features/articles/api";
import type { Article } from "@/features/articles/types";
import { allArticles as dummy } from "@/data/articles";

export type HybridAuthor = string | { name: string; avatar?: string } | null;

export type HybridArticle = {
  id: string | number;
  slug?: string;
  title: string;
  section?: string;
  category?: string;
  image?: string;
  cover?: string;
  thumbnail?: string;
  excerpt?: string;
  highlightQuote?: string;
  publishedAt?: string;
  date?: string;
  author?: HybridAuthor;
  isFeatured?: boolean;
  pdfUrl?: string;
  content?: Array<{ type: string; text: string }>;
  [key: string]: any;
};

function slugify(s?: string) {
  if (!s) return "";
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 128);
}
function pickKey(a: any) { return String(a?.id ?? a?.slug ?? a?.title ?? ""); }
function forceId(a: any, seed = ""): string | number {
  if (a?.id != null && a.id !== "") return a.id;
  if (a?.slug) return a.slug;
  if (a?.title) return slugify(a.title);
  return `article-${slugify(seed) || "x"}-${Math.random().toString(36).slice(2, 8)}`;
}

function normSection(raw?: string) {
  const s = (raw ?? "").toLowerCase().replace(/\s+/g, "-");
  if (["ideas-tradition", "ideas-&-tradition", "ideas-and-tradition"].includes(s)) return "ideas-tradition";
  if (["pop-cultures", "pop-culture-review", "pop-culture", "popculture"].includes(s)) return "pop-cultures";
  if (["reading-guides", "reading-guide"].includes(s)) return "reading-guides";
  if (["magazine"].includes(s)) return "magazine";
  if (["monologues", "monologue"].includes(s)) return "monologues";
  if (["research", "riset"].includes(s)) return "research";
  return raw ?? undefined;
}
function normCategory(raw?: string) {
  const c = (raw ?? "").toLowerCase().trim();
  if (c === "highlight") return "Highlight";
  if (c === "collection") return "Collection";
  if (c === "magazine") return "Magazine";
  if (c === "monologues" || c === "monologue") return "Monologues";
  if (c === "review") return "Review";
  return raw ?? undefined;
}
function normDate(d?: string) {
  if (!d) return undefined;
  const t = new Date(d);
  if (!isNaN(t.getTime())) return t.toISOString();
  const t2 = new Date(`${d}T00:00:00Z`);
  return isNaN(t2.getTime()) ? undefined : t2.toISOString();
}

function asAuthor(v: any): HybridAuthor {
  if (!v) return null;
  if (typeof v === "string") return v;
  if (v.name || v.avatar) return { name: String(v.name ?? ""), avatar: v.avatar ?? undefined };
  if ((v as any).researcher) return { name: String((v as any).researcher), avatar: undefined };
  return null;
}

function normalize(obj: any, seed = ""): HybridArticle {
  const researchTitle = obj?.research_title;
  const researchSum   = obj?.research_sum;
  const researchDate  = obj?.research_date;
  const researchPdf   = obj?.pdf || obj?.pdf_url || obj?.pdfUrl;

  const id     = forceId(obj, pickKey(obj) || seed);
  const title  = obj?.title ?? researchTitle ?? String(pickKey(obj) || id);
  const image  = obj?.image ?? obj?.cover ?? obj?.thumbnail ?? undefined;

  const authorRaw = obj?.author ?? obj?.researcher;
  const author    = asAuthor(authorRaw);

  const sectionRaw  = obj?.section ?? obj?.categorySection ?? obj?.type ?? obj?.field ?? obj?.fiel;
  const categoryRaw = obj?.category ?? obj?.tag;

  const publishedAt = obj?.publishedAt ?? obj?.published_at ?? obj?.date ?? obj?.dateISO ?? researchDate;

  const excerpt = obj?.excerpt ?? obj?.summary ?? obj?.description ?? researchSum;

  const content =
    Array.isArray(obj?.content) ? obj.content
    : Array.isArray(obj?.content_blocks) ? obj.content_blocks
    : undefined;

  return {
    ...(obj || {}),
    id,
    title,
    image,
    author,
    slug: obj?.slug ?? slugify(title),
    section: normSection(sectionRaw),
    category: normCategory(categoryRaw),
    publishedAt: normDate(publishedAt),
    excerpt,
    isFeatured: Boolean(obj?.isFeatured ?? obj?.featured ?? false),
    pdfUrl: researchPdf ?? undefined,
    content,
  } as HybridArticle;
}

function isComplete(a: HybridArticle) {
  return Boolean(
    a.title && a.section && a.category &&
    (a.publishedAt || a.date) &&
    (a.image || a.cover || a.thumbnail)
  );
}

function mergeHybrid(server: any[] | null | undefined, seed = "srv"): HybridArticle[] {
  const map: Record<string, HybridArticle> = {};

  for (const d of (dummy as any[]) || []) {
    const base = normalize(d, "dummy");
    const k = pickKey(base) || String(base.id);
    map[k] = base;
  }

  if (server && server.length) {
    for (const s of server) {
      const norm = normalize(s, seed);
      const k = pickKey(norm) || String(norm.id);
      const prev = map[k] ?? {};
      map[k] = {
        ...prev,
        ...norm,
        id: norm.id,
        title: norm.title ?? (prev as any).title,
        slug: norm.slug ?? (prev as any).slug,
        image: norm.image ?? (prev as any).image,
        category: norm.category ?? (prev as any).category,
        publishedAt: norm.publishedAt ?? (prev as any).publishedAt,
      } as HybridArticle;
    }
  }

  return Object.values(map);
}

function serverOnly(server: any[] | null | undefined, seed = "srv"): HybridArticle[] {
  return (server ?? []).map((s) => normalize(s, seed));
}

export function useHybridArticles() {
  const [server, setServer] = useState<Article[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await listArticles();
        if (!alive) return;
        setServer(Array.isArray(res) ? res : []);
      } catch (e: any) {
        setError(e?.message || "Failed to fetch articles");
        setServer(null);
      }
    })();
    return () => { alive = false; };
  }, []);

  const list = useMemo<HybridArticle[]>(() => {
    if (!server || server.length === 0) return mergeHybrid(server, "srv");
    const normalized = serverOnly(server, "srv");
    const allComplete = normalized.length > 0 && normalized.every(isComplete);
    if (allComplete) {
      return [...normalized].sort((a, b) =>
        String(b.publishedAt ?? "").localeCompare(String(a.publishedAt ?? ""))
      );
    }
    return mergeHybrid(server, "srv");
  }, [server]);

  return { list, articles: list, error, hasServer: Boolean(server && server.length) };
}

export function findArticleByParam(list: HybridArticle[], param?: string | number | null): HybridArticle | undefined {
  if (param == null) return undefined;
  const k = String(param).toLowerCase();
  return (
    list.find((a) => String(a.id).toLowerCase() === k) ||
    list.find((a) => String(a.slug ?? "").toLowerCase() === k) ||
    list.find((a) => String(a.title ?? "").toLowerCase() === k)
  );
}

export function useFindArticle(key?: string | number): HybridArticle | undefined {
  const { list } = useHybridArticles();
  return useMemo(() => findArticleByParam(list, key), [list, key]);
}