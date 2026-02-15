// src/features/admin/pages/AdminAddArticlePage.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { adminCreateArticle, normalizeBackendHtml } from "@/lib/content/api";
import type { ArticleDTO } from "@/lib/content/types";

type AdminArticleForm = {
  title: string;
  slug: string;
  author: string;
  date: string;
  excerpt: string;
  canonicalUrl: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  content: string;
  isPublished: boolean;
  isFeatured: boolean;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toISODateFromInput(date: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toISOString();
}

function formatDateShort(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const AdminAddArticlePage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<AdminArticleForm>({
    title: "",
    slug: "",
    author: "",
    date: new Date().toISOString().slice(0, 10),
    excerpt: "",
    canonicalUrl: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    content: "",
    isPublished: false,
    isFeatured: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewHtml = useMemo(() => {
    return form.content ? normalizeBackendHtml(form.content) : "";
  }, [form.content]);

  const updateField = <K extends keyof AdminArticleForm>(
    key: K,
    value: AdminArticleForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "title" && !prev.slug
        ? { slug: slugify(String(value)) }
        : {}),
    }));
  };

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setImagePreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleSubmit = async (publish: boolean) => {
    if (!form.title || !form.content) {
      setError("Minimal isi judul dan konten artikel (HTML).");
      return;
    }

    setError(null);
    setSubmitting(true);
    setForm((prev) =>
      prev.isPublished === publish ? prev : { ...prev, isPublished: publish }
    );

    try {
      const fd = new FormData();

      fd.append("title", form.title);
      if (form.slug) fd.append("slug", form.slug);

      if (form.author) fd.append("author", form.author);
      if (form.date) fd.append("date", toISODateFromInput(form.date));
      if (form.excerpt) fd.append("excerpt", form.excerpt);

      if (form.canonicalUrl) fd.append("canonical_url", form.canonicalUrl);
      if (form.metaTitle) fd.append("meta_title", form.metaTitle);
      if (form.metaDescription) fd.append("meta_description", form.metaDescription);
      if (form.keywords) fd.append("keywords", form.keywords);

      fd.append("content", form.content);
      fd.append("is_published", publish ? "true" : "false");
      fd.append("is_featured", form.isFeatured ? "true" : "false");

      if (imageFile) fd.append("image", imageFile);

      const created: ArticleDTO = await adminCreateArticle(fd);

      if (created) navigate(ROUTES.ADMIN.ARTICLES);
      else navigate(ROUTES.ADMIN.ARTICLES);
    } catch (e: any) {
      setError(e?.message || "Gagal menyimpan artikel. Cek kembali data yang kamu isi.");
    } finally {
      setSubmitting(false);
    }
  };

  const isPublished = Boolean(form.isPublished);
  const isFeatured = Boolean(form.isFeatured);

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">NEW ARTICLE</h1>
          <p className="text-sm text-neutral-400 mt-3 max-w-xl">
            Buat artikel baru. Data akan dikirim ke{" "}
            <span className="font-mono">/api/articel</span>.
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
              <label className="text-xs text-neutral-400 tracking-[0.15em]">TITLE</label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-white"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Judul artikel"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">SLUG</label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-white font-mono"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="slug-judul"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">AUTHOR</label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-white"
                value={form.author}
                onChange={(e) => updateField("author", e.target.value)}
                placeholder="Nama penulis"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">DATE</label>
              <input
                type="date"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-white"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">EXCERPT</label>
            <textarea
              className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-white min-h-[60px]"
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              placeholder="Ringkasan singkat..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">CANONICAL URL</label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-white"
                value={form.canonicalUrl}
                onChange={(e) => updateField("canonicalUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">KEYWORDS</label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-white"
                value={form.keywords}
                onChange={(e) => updateField("keywords", e.target.value)}
                placeholder="keyword1, keyword2..."
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">META TITLE</label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-white"
                value={form.metaTitle}
                onChange={(e) => updateField("metaTitle", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">META DESCRIPTION</label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-white"
                value={form.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">COVER IMAGE</label>
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
            <label className="text-xs text-neutral-400 tracking-[0.15em]">CONTENT (HTML)</label>
            <textarea
              className="bg-black border border-zinc-700 rounded-2xl px-3 py-2 text-xs outline-none focus:border-white min-h-[260px] font-mono leading-relaxed"
              value={form.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="<h1>Judul</h1><p>Paragraf...</p>"
            />
          </div>

          {error && <p className="text-sm text-red-400 mt-1">{error}</p>}

          <div className="flex flex-wrap items-center gap-3 justify-between pt-3 border-t border-zinc-800 mt-2">
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-xs text-neutral-300">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-zinc-600 bg-black"
                  checked={form.isPublished}
                  onChange={(e) => updateField("isPublished", e.target.checked)}
                />
                <span>Publish ke user</span>
              </label>

              <label className="inline-flex items-center gap-2 text-xs text-neutral-300">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-zinc-600 bg-black"
                  checked={form.isFeatured}
                  onChange={(e) => updateField("isFeatured", e.target.checked)}
                />
                <span>Featured</span>
              </label>

              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-[11px] ${
                  isPublished
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                    : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40"
                }`}
              >
                {isPublished ? "Published" : "Draft"}
              </span>

              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-[11px] ${
                  isFeatured
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                    : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40"
                }`}
              >
                {isFeatured ? "Featured" : "Draft"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit(false)}
                className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                           hover:bg-zinc-800 disabled:opacity-50 cursor-pointer"
              >
                SAVE AS DRAFT / PREVIEW
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmit(true)}
                className="px-4 py-2 rounded-full border border-white bg-white text-black text-xs tracking-[0.15em]
                           hover:bg-transparent hover:text-white hover:border-white disabled:opacity-50 cursor-pointer"
              >
                SAVE &amp; PUBLISH
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
              <span className="text-[11px] text-neutral-500">
                {formatDateShort(form.date ? toISODateFromInput(form.date) : "")}
              </span>
              <span className="text-[11px] text-neutral-500">
                • {form.author || "Author tidak di-set"}
              </span>

              <div className="ml-auto flex items-center gap-2">
                <span
                  className={`text-[11px] px-2 py-1 rounded-full ${
                    isPublished
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                      : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40"
                  }`}
                >
                  {isPublished ? "Published" : "Draft / Preview"}
                </span>

                <span
                  className={`text-[11px] px-2 py-1 rounded-full ${
                    isFeatured
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                      : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40"
                  }`}
                >
                  {isFeatured ? "Featured" : "Draft"}
                </span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold mb-4">
              {form.title || "Judul artikel"}
            </h1>

            {form.excerpt && (
              <p className="text-sm text-neutral-300 mb-4">{form.excerpt}</p>
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
                __html: previewHtml || "Konten HTML akan tampil di sini...",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddArticlePage;