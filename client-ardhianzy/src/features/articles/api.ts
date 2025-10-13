// src/features/articles/api.ts
import { endpoints } from "@/config/endpoints";
import { authHeader } from "@/lib/http";

export type CreateOrUpdatePayload = {
  id?: string | number;
  title: string;
  slug: string;
  author?: string;
  excerpt?: string;
  content?: string;       // HTML/string
  publishedAt?: string;   // yyyy-mm-dd
  isFeatured?: boolean;   // tidak dikirim ke BE (hybrid-only)
  highlightQuote?: string;// tidak dikirim ke BE (hybrid-only)
  section?: string;       // tidak dikirim ke BE (hybrid-only)
  category?: string;      // tidak dikirim ke BE (hybrid-only)
  image?: File | null;
  pdf?: File | null;      // untuk research, kalau nanti dipakai
  // meta
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
};

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

/** === READ === */
export async function listArticles(): Promise<any[]> {
  const [aRes, rRes] = await Promise.allSettled([
    fetch(endpoints.articles.list(), { headers: { ...authHeader() } }),
    fetch(endpoints.research.list(), { headers: { ...authHeader() } }),
  ]);

  const articles: any[] =
    aRes.status === "fulfilled" ? (await aRes.value.json().catch(() => [])) ?? [] : [];
  const research: any[] =
    rRes.status === "fulfilled" && rRes.value.ok
      ? (await rRes.value.json().catch(() => [])) ?? []
      : [];

  const researchTagged = research.map((it) => ({ section: "research", ...it }));

  return [...articles, ...researchTagged];
}

export async function getArticleByTitle(title: string): Promise<any> {
  const res = await fetch(endpoints.articles.byTitle(title), {
    headers: { ...authHeader() },
  });
  return json(res);
}

export async function getArticleById(id: string | number): Promise<any> {
  const tryDirect = await fetch(endpoints.articles.byId(id), {
    headers: { ...authHeader() },
  });
  if (tryDirect.ok) return await tryDirect.json();

  const list = await listArticles();
  return list.find((x: any) => String(x.id) === String(id));
}

/** === CREATE / UPDATE (multipart) === */
function buildArticleFormData(p: CreateOrUpdatePayload): FormData {
  const fd = new FormData();
  if (p.title) fd.set("title", p.title);
  if (p.slug) fd.set("slug", p.slug);
  if (p.author) fd.set("author", p.author);
  if (p.excerpt) fd.set("excerpt", p.excerpt);
  if (p.content) fd.set("content", p.content);

  if (p.publishedAt) fd.set("date", p.publishedAt);

  if (p.image) fd.set("image", p.image);

  fd.set("meta_title", p.metaTitle || p.title || "");
  fd.set("meta_description", p.metaDescription || p.excerpt || "");
  if (p.keywords) fd.set("keywords", p.keywords);
  if (p.canonicalUrl) fd.set("canonical_url", p.canonicalUrl);

  // Catatan: section/category/isFeatured/highlightQuote/pdf tidak dikirim karena belum ada di YAML endpoints "articel".
  return fd;
}

export async function createArticle(p: CreateOrUpdatePayload): Promise<any> {
  const res = await fetch(endpoints.articles.create(), {
    method: "POST",
    headers: { ...authHeader() },
    body: buildArticleFormData(p),
  });
  return json(res);
}

export async function updateArticle(id: string | number, p: CreateOrUpdatePayload): Promise<any> {
  const res = await fetch(endpoints.articles.update(id), {
    method: "PUT",
    headers: { ...authHeader() },
    body: buildArticleFormData(p),
  });
  return json(res);
}

export async function deleteArticle(id: string | number): Promise<void> {
  const res = await fetch(endpoints.articles.delete(id), {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error(`Failed to delete (${res.status})`);
}