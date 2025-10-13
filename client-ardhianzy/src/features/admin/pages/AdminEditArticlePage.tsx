// src/features/admin/pages/AdminEditArticlePage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getArticleById, updateArticle, type CreateOrUpdatePayload } from "@/features/articles/api";

export default function AdminEditArticlePage() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]  = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // form state (disamakan dengan Add)
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [publishedAt, setPublishedAt] = useState(""); // yyyy-mm-dd
  const [image, setImage] = useState<File | null>(null);

  // hybrid-only (tidak dikirim ke BE "articel", tapi kita tetap tampilkan bila ada)
  const [section, setSection] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [highlightQuote, setHighlightQuote] = useState<string>("");

  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const a = await getArticleById(String(id));
        if (!alive || !a) return;

        setTitle(a.title ?? "");
        setSlug(a.slug ?? "");
        setAuthor(typeof a.author === "string" ? a.author : a.author?.name ?? "");
        setExcerpt(a.excerpt ?? a.meta_description ?? "");
        setContent(a.content ?? "");
        // dukung "date" atau "publishedAt" dari server
        const d = (a.date ?? a.publishedAt ?? "").slice(0, 10);
        setPublishedAt(d);

        setSection(a.section ?? "");
        setCategory(a.category ?? "");
        setIsFeatured(Boolean(a.isFeatured ?? a.featured));
        setHighlightQuote(a.highlightQuote ?? "");

        setCurrentImageUrl(a.image ?? a.cover ?? a.thumbnail ?? "");
      } catch (e: any) {
        setMessage(e?.message || "Gagal memuat artikel");
      } finally {
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;

    setSaving(true);
    setMessage(null);

    const payload: CreateOrUpdatePayload = {
      title, slug, author, excerpt, content,
      publishedAt: publishedAt || undefined,
      image: image ?? undefined,
      // hybrid-only (tidak terkirim ke BE "articel"; aman untuk auth):
      section, category, isFeatured, highlightQuote,
    };

    try {
      await updateArticle(id, payload);
      setMessage("Perubahan berhasil disimpan.");
    } catch (e: any) {
      setMessage(e?.message || "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Memuat…</p>;

  return (
    <div>
      <h2>Edit Article</h2>
      <p>Perbarui informasi artikel di bawah ini.</p>

      <form onSubmit={onSubmit} className="bg-white border border-[#e2e8f0] rounded-[12px] p-6 mt-4 space-y-4">
        {message && <div className="text-sm p-3 rounded border" style={{borderColor:'#e2e8f0'}}>{message}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-[#4a5568]">Title</span>
            <input value={title} onChange={(e)=>setTitle(e.target.value)} required className="mt-1 w-full rounded border px-3 py-2" />
          </label>

          <label className="block">
            <span className="text-sm text-[#4a5568]">Slug</span>
            <input value={slug} onChange={(e)=>setSlug(e.target.value)} required className="mt-1 w-full rounded border px-3 py-2" />
          </label>

          <label className="block">
            <span className="text-sm text-[#4a5568]">Author</span>
            <input value={author} onChange={(e)=>setAuthor(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
          </label>

          <label className="block">
            <span className="text-sm text-[#4a5568]">Published At</span>
            <input type="date" value={publishedAt} onChange={(e)=>setPublishedAt(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-[#4a5568]">Excerpt</span>
          <textarea value={excerpt} onChange={(e)=>setExcerpt(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 h-24" />
        </label>

        <label className="block">
          <span className="text-sm text-[#4a5568]">Content (opsional)</span>
          <textarea value={content} onChange={(e)=>setContent(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 h-32" />
        </label>

        {/* hybrid-only controls (tidak merusak style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-[#4a5568]">Section (hybrid)</span>
            <input value={section} onChange={(e)=>setSection(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" placeholder="research / ideas-tradition / ..." />
          </label>

          <label className="block">
            <span className="text-sm text-[#4a5568]">Category (hybrid)</span>
            <input value={category} onChange={(e)=>setCategory(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" placeholder="Highlight / Monologues / ..." />
          </label>
        </div>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={isFeatured} onChange={(e)=>setIsFeatured(e.target.checked)} />
          <span className="text-sm text-[#4a5568]">Featured (hybrid)</span>
        </label>

        <label className="block">
          <span className="text-sm text-[#4a5568]">Highlight Quote (hybrid, opsional)</span>
          <textarea value={highlightQuote} onChange={(e)=>setHighlightQuote(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 h-20" />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-[#4a5568]">Image</span>
            <input type="file" accept="image/*" onChange={(e)=>setImage(e.target.files?.[0] ?? null)} className="mt-1" />
            {currentImageUrl ? (
              <div className="mt-2 text-xs text-[#4a5568]">
                <div>Current:</div>
                <img src={currentImageUrl} alt="current" className="mt-1 max-h-[120px] object-cover rounded border" />
              </div>
            ) : null}
          </label>

          <div className="block">
            <span className="text-sm text-[#4a5568]"> </span>
            <div className="mt-1 text-sm text-[#4a5568]">
              Gambar baru akan menggantikan gambar lama saat disimpan.
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button disabled={saving} className="px-4 py-2 rounded bg-[#2d3748] text-white disabled:opacity-60">
            {saving ? "Menyimpan…" : "Simpan Perubahan"}
          </button>
          <Link to="/admin/articles/list" className="text-[#2b6cb0] no-underline">← Kembali</Link>
        </div>
      </form>
    </div>
  );
}