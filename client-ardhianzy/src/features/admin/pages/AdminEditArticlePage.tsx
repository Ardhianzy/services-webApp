// src/features/admin/pages/AdminEditArticlePage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import {
  adminFetchArticles,
  adminUpdateArticle,
  normalizeBackendHtml,
} from "@/lib/content/api";
import type { ArticleDTO } from "@/lib/content/types";
import type { ArticleCategory } from "./AdminAddArticlePage";

type AdminArticleForm = {
  title: string;
  slug: string;
  author: string;
  date: string;
  category: ArticleCategory;
  excerpt: string;
  canonicalUrl: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  content: string;
  isPublished: boolean;
};

function toISODateFromInput(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toISOString();
}

function dateInputFromISO(value?: string): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

const AdminEditArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<AdminArticleForm | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof AdminArticleForm>(
    key: K,
    value: AdminArticleForm[K]
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  useEffect(() => {
    if (!id) {
      setError("ID artikel tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const list: ArticleDTO[] = await adminFetchArticles();
        if (cancelled) return;

        const raw: any =
          (list ?? []).find((item: any) => String(item.id) === String(id)) ??
          null;

        if (!raw) {
          setForm(null);
          setError("Artikel tidak ditemukan.");
          return;
        }

        const formData: AdminArticleForm = {
          title: raw.title ?? "",
          slug: raw.slug ?? "",
          author: raw.author ?? "",
          date: dateInputFromISO(raw.date),
          category: raw.category as ArticleCategory,
          excerpt: raw.excerpt ?? "",
          canonicalUrl: raw.canonical_url ?? "",
          metaTitle: raw.meta_title ?? "",
          metaDescription: raw.meta_description ?? "",
          keywords: raw.keywords ?? "",
          content: raw.content ?? "",
          isPublished: Boolean(raw.is_published),
        };

        setForm(formData);

        if (raw.image && typeof raw.image === "string") {
          setImagePreviewUrl(raw.image);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(
            e?.message || "Gagal memuat data artikel untuk di-edit."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file ?? null);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
  };

  const handleSubmit = async () => {
    if (!id || !form) return;

    if (!form.title || !form.content) {
      setError("Minimal isi judul dan konten artikel (HTML).");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const fd = new FormData();

      fd.append("title", form.title);
      if (form.slug) fd.append("slug", form.slug);
      if (imageFile) fd.append("image", imageFile);
      fd.append("content", form.content);
      if (form.author) fd.append("author", form.author);
      if (form.date) fd.append("date", toISODateFromInput(form.date));
      if (form.metaTitle) fd.append("meta_title", form.metaTitle);
      if (form.metaDescription)
        fd.append("meta_description", form.metaDescription);
      if (form.keywords) fd.append("keywords", form.keywords);
      if (form.excerpt) fd.append("excerpt", form.excerpt);
      if (form.canonicalUrl)
        fd.append("canonical_url", form.canonicalUrl);
      fd.append("category", form.category);
      fd.append("is_published", String(form.isPublished));

      await adminUpdateArticle(id, fd);

      navigate(ROUTES.ADMIN.ARTICLES);
    } catch (e: any) {
      setError(
        e?.message ||
          "Gagal menyimpan perubahan artikel. Cek kembali data yang kamu ubah."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-10 py-8 flex items-center justify-center">
        <p className="text-sm text-neutral-400">
          Memuat artikel untuk di-edit...
        </p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-black text-white px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-[0.15em]">
            EDIT ARTICLE
          </h1>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.ARTICLES)}
            className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                       hover:bg-white hover:text-black transition cursor-pointer"
          >
            KEMBALI KE LIST
          </button>
        </div>
        <p className="text-sm text-red-400">
          {error || "Artikel tidak ditemukan."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            EDIT ARTICLE
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Perbarui konten artikel. Perubahan akan meng-update data pada
            endpoint <span className="font-mono">/api/articel</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.ARTICLES)}
          className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                     hover:bg-white hover:text-black transition cursor-pointer"
        >
          KEMBALI KE LIST
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)]">
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                TITLE
              </label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                           focus:border-white"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                SLUG
              </label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                           focus:border-white font-mono"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                KATEGORI
              </label>
              <select
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                           focus:border-white"
                value={form.category}
                onChange={(e) =>
                  updateField(
                    "category",
                    e.target.value as ArticleCategory
                  )
                }
              >
                <option value="READING_GUIDLINE">Reading Guide</option>
                <option value="IDEAS_AND_TRADITIONS">Ideas & Tradition</option>
                <option value="POP_CULTURE">Popsophia / Pop Culture</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                AUTHOR
              </label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                           focus:border-white"
                value={form.author}
                onChange={(e) => updateField("author", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                DATE
              </label>
              <input
                type="date"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                           focus:border-white"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              EXCERPT
            </label>
            <textarea
              className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                         focus:border-white min-h-[60px]"
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                CANONICAL URL
              </label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                           focus:border-white"
                value={form.canonicalUrl}
                onChange={(e) =>
                  updateField("canonicalUrl", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                KEYWORDS
              </label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                           focus:border-white"
                value={form.keywords}
                onChange={(e) =>
                  updateField("keywords", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                META TITLE (SEO)
              </label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                           focus:border-white"
                value={form.metaTitle}
                onChange={(e) =>
                  updateField("metaTitle", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                META DESCRIPTION (SEO)
              </label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                           focus:border-white"
                value={form.metaDescription}
                onChange={(e) =>
                  updateField("metaDescription", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              COVER IMAGE
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-xs text-neutral-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-full
                         file:border file:border-zinc-600 file:bg-zinc-900 file:text-xs
                         file:hover:bg-zinc-800 cursor-pointer"
            />
            {imagePreviewUrl && (
              <div className="mt-2 rounded-2xl overflow-hidden border border-zinc-800 max-h-56">
                <img
                  src={imagePreviewUrl}
                  alt="Preview cover"
                  className="w-full h-56 object-cover"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              CONTENT (HTML)
            </label>
            <textarea
              className="bg-black border border-zinc-700 rounded-2xl px-3 py-2 text-xs outline-none
                         focus:border-white min-h-[260px] font-mono leading-relaxed"
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 mt-1">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 justify-between pt-3 border-t border-zinc-800 mt-2">
            <label className="inline-flex items-center gap-2 text-xs text-neutral-300">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-zinc-600 bg-black"
                checked={form.isPublished}
                onChange={(e) =>
                  updateField("isPublished", e.target.checked)
                }
              />
              <span>Publish ke user</span>
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="px-4 py-2 rounded-full border border-white bg-white text-black text-xs tracking-[0.15em]
                           hover:bg-transparent hover:text-white hover:border-white disabled:opacity-50 cursor-pointer"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 overflow-hidden">
          <h2 className="text-sm font-medium tracking-[0.15em] text-neutral-400 mb-4">
            LIVE PREVIEW (HTML)
          </h2>
          <div className="bg-black rounded-2xl border border-zinc-800 p-6 h-full overflow-y-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                {form.category}
              </span>
              {form.date && (
                <span className="text-[11px] text-neutral-500">
                  {form.date}
                </span>
              )}
              {form.author && (
                <span className="text-[11px] text-neutral-500">
                  • {form.author}
                </span>
              )}
              <span
                className={`ml-auto text-[11px] px-2 py-1 rounded-full ${
                  form.isPublished
                    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                    : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40"
                }`}
              >
                {form.isPublished ? "Published" : "Draft / Preview"}
              </span>
            </div>

            <style>{`
              .card-typography{
                font-family: Roboto, ui-sans-serif, system-ui;
                font-size: 1.02rem;
                line-height: 1.85;
                color: #fff;
                text-align: justify;
                text-justify: inter-word;
                hyphens: auto;
                word-break: break-word;
              }
              .card-typography h1,.card-typography h2,.card-typography h3,.card-typography h4{
                font-family: Roboto, ui-sans-serif, system-ui;
                font-weight: 700;
                line-height: 1.25;
                margin: .85em 0 .45em;
                letter-spacing: .2px;
              }
              .card-typography h1{font-size:1.15rem}
              .card-typography h2{font-size:1.08rem}
              .card-typography h3{font-size:1.04rem}
              .card-typography h4{font-size:1.02rem}
              .card-typography p{margin:0 0 1em}
              .card-typography blockquote{margin:1em 0;padding:.75em 1em;border-left:3px solid rgba(255,255,255,.35);background:rgba(255,255,255,.04);border-radius:8px}
              .card-typography blockquote p{margin:.4em 0}
              .card-typography blockquote footer{margin-top:.55em;opacity:.85;font-size:.92em}
              .card-typography ul,.card-typography ol{margin:.6em 0 1.1em;padding-left:1.3em}
              .card-typography ul{list-style:disc}
              .card-typography ol{list-style:decimal}
              .card-typography img,.card-typography video,.card-typography iframe{max-width:100%;height:auto}
              .card-typography a{color:#fff;text-decoration:underline;text-underline-offset:2px;text-decoration-color:rgba(255,255,255,.6)}

              .card-typography table{
                width: 100%;
                border-collapse: collapse;
                margin: 1.1em 0;
                font-size: 0.98rem;
                text-align: left;
              }
              .card-typography thead th{
                background: rgba(255,255,255,.06);
                font-weight: 700;
              }
              .card-typography th,
              .card-typography td{
                border: 1px solid rgba(255,255,255,.28);
                padding: .55em .8em;
                vertical-align: top;
                text-align: left;
                text-justify: auto;
                hyphens: auto;
                word-break: break-word;
              }
              .card-typography tbody tr:nth-child(even){
                background: rgba(255,255,255,.02);
              }

              @media (max-width: 768px){
                .card-typography{
                  font-size:1rem;
                  line-height:1.8;
                }
                .card-typography table{
                  display: block;
                  width: 100%;
                  overflow-x: auto;
                  -webkit-overflow-scrolling: touch;
                }
              }
            `}</style>

            <h1 className="text-2xl md:text-3xl font-semibold mb-4">
              {form.title || "Judul artikel"}
            </h1>

            {form.excerpt && (
              <p className="text-sm text-neutral-300 mb-4">
                {form.excerpt}
              </p>
            )}

            {imagePreviewUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden border border-zinc-800">
                <img
                  src={imagePreviewUrl}
                  alt="Preview cover"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            <div
              className="card-typography prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: form.content
                  ? normalizeBackendHtml(form.content)
                  : "Konten HTML akan tampil di sini...",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditArticlePage;