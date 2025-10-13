// src/features/admin/pages/AdminAddArticlePage.tsx
import { useState } from "react";
import { createArticle } from "@/features/articles/api";

const sections = [
  "research",
  "ideas-tradition",
  "magazine",
  "monologues",
  "pop-cultures",
  "reading-guides",
];

export default function AdminAddArticlePage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [section, setSection] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [excerpt, setExcerpt] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [highlightQuote, setHighlightQuote] = useState<string>("");

  const [image, setImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      await createArticle({
        title, slug,
        section: section || undefined,
        category: category || undefined,
        author: author || undefined,
        excerpt: excerpt || undefined,
        content: content || undefined,
        publishedAt: publishedAt || undefined,
        isFeatured,
        highlightQuote: highlightQuote || undefined,
        image,
        pdf,
      });
      setMessage("Artikel berhasil ditambahkan");
      // reset form
      setTitle(""); setSlug(""); setSection(""); setCategory(""); setAuthor("");
      setExcerpt(""); setContent(""); setPublishedAt(""); setIsFeatured(false); setHighlightQuote("");
      setImage(null); setPdf(null);
    } catch (e: any) {
      setMessage(e?.message || "Gagal menambah artikel");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2>Add New Article</h2>
      <p>Gunakan form di bawah ini untuk menambahkan artikel baru.</p>

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
            <span className="text-sm text-[#4a5568]">Section</span>
            <select value={section} onChange={(e)=>setSection(e.target.value)} className="mt-1 w-full rounded border px-3 py-2">
              <option value="">—</option>
              {sections.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-[#4a5568]">Category</span>
            <input value={category} onChange={(e)=>setCategory(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" placeholder="Highlight / Monologues / Magazine / Review / ..." />
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

        <label className="block">
          <span className="text-sm text-[#4a5568]">Highlight Quote (opsional)</span>
          <textarea value={highlightQuote} onChange={(e)=>setHighlightQuote(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 h-20" />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm text-[#4a5568]">Image</span>
            <input type="file" accept="image/*" onChange={(e)=>setImage(e.target.files?.[0] ?? null)} className="mt-1" />
          </label>

          <label className="block">
            <span className="text-sm text-[#4a5568]">PDF (opsional)</span>
            <input type="file" accept="application/pdf" onChange={(e)=>setPdf(e.target.files?.[0] ?? null)} className="mt-1" />
          </label>
        </div>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={isFeatured} onChange={(e)=>setIsFeatured(e.target.checked)} />
          <span className="text-sm text-[#4a5568]">Featured</span>
        </label>

        <div className="pt-2">
          <button disabled={saving} className="px-4 py-2 rounded bg-[#2d3748] text-white disabled:opacity-60">{saving?"Menyimpan…":"Simpan"}</button>
        </div>
      </form>
    </div>
  );
}