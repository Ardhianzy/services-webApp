// src/features/admin/pages/AdminResearchShopCollectedPage.tsx
import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "@/config/endpoints";

// Research
import type { ResearchItem } from "@/features/research/types";
import { listResearch, createResearch } from "@/features/research/api";

// Shop
import type { ShopItem } from "@/features/shop/types";
import { listShop, createShop, updateShop, deleteShop } from "@/features/shop/api";

// Collected
import type { CollectedItem } from "@/features/collected/types";
import { listCollected, createCollected, updateCollected, deleteCollected } from "@/features/collected/api";

type TabKey = "research" | "shop" | "collected";

function toAbs(url?: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

function SectionHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <header className="mb-6">
      <h2 className="m-0 text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48 }}>
        {title}
      </h2>
      {desc && (
        <p className="m-0 mt-1 text-white/70" style={{ fontFamily: "Roboto, sans-serif", fontSize: 14 }}>
          {desc}
        </p>
      )}
    </header>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block mb-1 text-sm text-white/80" style={{ fontFamily: "Roboto, sans-serif" }}>
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-xs text-white/50" style={{ fontFamily: "Roboto, sans-serif" }}>
          {hint}
        </span>
      )}
    </label>
  );
}

/* ===================== RESEARCH ===================== */
function ResearchPanel() {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // form
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [researcher, setResearcher] = useState("");
  const [field, setField] = useState("");
  const [keywords, setKeywords] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [pdf, setPdf] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const data = await listResearch();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Gagal memuat research");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await createResearch({ title, content, researcher, field, keywords, publishedAt, pdf, image });
      setTitle(""); setContent(""); setResearcher(""); setField(""); setKeywords(""); setPublishedAt("");
      setPdf(null); setImage(null);
      await refresh();
      alert("Research berhasil ditambahkan.");
    } catch (e: any) {
      setErr(e?.message || "Gagal menambahkan research");
    }
  }

  return (
    <section className="mt-6">
      <SectionHeader
        title="Research"
        desc="List + tambah research. (Per YAML: hanya list & create yang available untuk endpoint ini.)"
      />

      {/* List */}
      <div className="mb-10 overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-[800px] w-full border-collapse">
          <thead>
            <tr className="bg-white/5">
              <th className="p-3 text-left text-white/90">Judul</th>
              <th className="p-3 text-left text-white/90">Tanggal</th>
              <th className="p-3 text-left text-white/90">Researcher</th>
              <th className="p-3 text-left text-white/90">Image</th>
            </tr>
          </thead>
          <tbody>
            {(loading ? [] : items).map((r, idx) => {
              const date = (r as any).research_date ?? (r as any).publishedAt ?? "";
              const img = toAbs((r as any).image ?? (r as any).thumbnail ?? "");
              const researcherName = (r as any).researcher ?? (r as any).source ?? "";
              return (
                <tr key={`${r.id ?? idx}`} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-3">{(r as any).title ?? (r as any).research_title ?? "Untitled"}</td>
                  <td className="p-3">{date ? new Date(date).toLocaleDateString("id-ID") : "—"}</td>
                  <td className="p-3">{researcherName || "—"}</td>
                  <td className="p-3">
                    {img ? <img src={img} alt="" className="h-12 w-12 object-cover rounded" /> : "—"}
                  </td>
                </tr>
              );
            })}
            {!loading && items.length === 0 && (
              <tr><td className="p-3 text-white/60" colSpan={4}>Belum ada data</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="grid grid-cols-1 gap-4 rounded-xl border border-white/10 p-5">
        <h3 className="m-0 mb-2 text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28 }}>
          Tambah Research
        </h3>

        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" required />
        </Field>
        <Field label="Summary / Content">
          <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" rows={4} />
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Researcher / Source">
            <input value={researcher} onChange={(e) => setResearcher(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" />
          </Field>
          <Field label="Field">
            <input value={field} onChange={(e) => setField(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" />
          </Field>
          <Field label="Keywords (comma-separated)">
            <input value={keywords} onChange={(e) => setKeywords(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Research Date">
            <input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" />
          </Field>
          <Field label="PDF (optional)">
            <input type="file" accept="application/pdf" onChange={(e) => setPdf(e.target.files?.[0] ?? null)} className="w-full rounded bg-[#121212] p-2 text-white file:mr-2 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1" />
          </Field>
          <Field label="Image (optional)">
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="w-full rounded bg-[#121212] p-2 text-white file:mr-2 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1" />
          </Field>
        </div>

        {err && <div className="text-red-400 text-sm">{err}</div>}

        <div className="mt-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-[30px] border border-[#F5F5F5] px-6 py-2 text-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-black transition"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}
          >
            SIMPAN
          </button>
        </div>
      </form>
    </section>
  );
}

/* ===================== SHOP / PRODUCTS ===================== */
function ShopPanel() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // form (create/update)
  const [editId, setEditId] = useState<string | number | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [author, setAuthor] = useState("");
  const [buyer, setBuyer] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [researchLink, setResearchLink] = useState("");

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const data = await listShop();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Gagal memuat shop");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); }, []);

  function populateForm(s: ShopItem) {
    setEditId(s.id ?? null);
    setTitle(s.title ?? "");
    setDesc(s.description ?? "");
    setPrice(typeof s.price === "number" ? s.price : (s.price as any) ? Number(s.price) : undefined);
    setCategory(s.category ?? "");
    setCondition(s.condition ?? "");
    setAuthor(s.author ?? "");
    setBuyer(s.buyer ?? "");
    setMessage(s.message ?? "");
    setIsAvailable(s.is_available ?? true);
    setMetaTitle((s as any).meta_title ?? "");
    setMetaDesc((s as any).meta_description ?? "");
    setResearchLink((s as any).researchLink ?? "");
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function resetForm() {
    setEditId(null);
    setTitle(""); setDesc(""); setPrice(undefined); setCategory(""); setCondition(""); setAuthor("");
    setBuyer(""); setMessage(""); setIsAvailable(true); setImage(null);
    setMetaTitle(""); setMetaDesc(""); setResearchLink("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      const payload: any = {
        title, description: desc, price, category, condition, author,
        buyer: buyer || undefined, message: message || undefined, is_available: isAvailable,
        image: image ?? undefined, meta_title: metaTitle || undefined, meta_description: metaDesc || undefined,
        researchLink: researchLink || undefined,
      };
      if (editId != null) {
        await updateShop(editId, payload);
        alert("Produk diperbarui.");
      } else {
        await createShop(payload);
        alert("Produk ditambahkan.");
      }
      resetForm();
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "Gagal simpan produk");
    }
  }

  async function handleDelete(id: string | number | undefined) {
    if (!id) return;
    if (!confirm("Hapus produk ini?")) return;
    try {
      await deleteShop(id);
      await refresh();
    } catch (e: any) {
      alert(e?.message || "Gagal menghapus");
    }
  }

  return (
    <section className="mt-12">
      <SectionHeader title="Shop / Products" desc="CRUD untuk produk toko (sesuai Ardhianzy.yaml)" />

      {/* List */}
      <div className="mb-10 overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-[1000px] w-full border-collapse">
          <thead>
            <tr className="bg-white/5">
              <th className="p-3 text-left text-white/90">Gambar</th>
              <th className="p-3 text-left text-white/90">Title</th>
              <th className="p-3 text-left text-white/90">Harga</th>
              <th className="p-3 text-left text-white/90">Kategori</th>
              <th className="p-3 text-left text-white/90">Condition</th>
              <th className="p-3 text-left text-white/90">Author</th>
              <th className="p-3 text-left text-white/90">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(loading ? [] : items).map((s) => {
              const img = toAbs((s as any).image);
              return (
                <tr key={String(s.id)} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-3">{img ? <img src={img} alt="" className="h-12 w-12 object-cover rounded" /> : "—"}</td>
                  <td className="p-3">{s.title}</td>
                  <td className="p-3">{typeof s.price === "number" ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(s.price) : s.price ?? "—"}</td>
                  <td className="p-3">{s.category ?? "—"}</td>
                  <td className="p-3">{s.condition ?? "—"}</td>
                  <td className="p-3">{s.author ?? "—"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => populateForm(s)}
                        className="rounded border border-white/30 px-3 py-1 text-sm hover:bg-white/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s.id)}
                        className="rounded border border-red-400/50 px-3 py-1 text-sm text-red-300 hover:bg-red-500/10"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && items.length === 0 && (
              <tr><td className="p-3 text-white/60" colSpan={7}>Belum ada data</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-xl border border-white/10 p-5">
        <h3 className="m-0 mb-2 text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28 }}>
          {editId ? "Edit Produk" : "Tambah Produk"}
        </h3>

        <Field label="Title">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" required />
        </Field>

        <Field label="Description">
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" rows={3} />
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Price (number)">
            <input type="number" value={price ?? ""} onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)} className="w-full rounded bg-[#121212] p-2 text-white" />
          </Field>
          <Field label="Category">
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" />
          </Field>
          <Field label="Condition / Theme">
            <input value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Author">
            <input value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" />
          </Field>
          <Field label="Buyer (opsional)">
            <input value={buyer} onChange={(e) => setBuyer(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" />
          </Field>
          <Field label="Available?">
            <select value={String(isAvailable)} onChange={(e) => setIsAvailable(e.target.value === "true")} className="w-full rounded bg-[#121212] p-2 text-white">
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </Field>
        </div>

        <Field label="Message (opsional)">
          <input value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" />
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Image (opsional)">
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="w-full rounded bg-[#121212] p-2 text-white file:mr-2 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1" />
          </Field>
          <Field label="Meta Title (opsional)">
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" />
          </Field>
          <Field label="Meta Description (opsional)">
            <input value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" />
          </Field>
        </div>

        <Field label="Related Research Link (opsional)">
          <input value={researchLink} onChange={(e) => setResearchLink(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" />
        </Field>

        {err && <div className="text-red-400 text-sm">{err}</div>}

        <div className="mt-2 flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-[30px] border border-[#F5F5F5] px-6 py-2 text-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-black transition"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}
          >
            {editId ? "UPDATE" : "SIMPAN"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center rounded-[30px] border border-white/30 px-6 py-2 text-white hover:bg-white/10 transition"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}
            >
              BATAL
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

/* ===================== COLLECTED ===================== */
function CollectedPanel() {
  const [items, setItems] = useState<CollectedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [editId, setEditId] = useState<string | number | null>(null);
  const [title, setTitle] = useState("");
  const [dialog, setDialog] = useState("");
  const [image, setImage] = useState<File | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const data = await listCollected();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Gagal memuat collected");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { refresh(); }, []);

  function populateForm(c: CollectedItem) {
    setEditId(c.id ?? null);
    setTitle(c.title ?? "");
    setDialog((c as any).dialog ?? "");
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function resetForm() {
    setEditId(null); setTitle(""); setDialog(""); setImage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      if (editId != null) {
        // update endpoint kita pakai JSON (lihat api.ts). Image update belum di-wire di API.
        await updateCollected(editId, { title } as any);
        alert("Collected diperbarui (catatan: gambar tidak diubah via update).");
      } else {
        await createCollected({ title, ...(dialog ? { dialog } : {}), ...(image ? { image } : {}) } as any);
        alert("Collected ditambahkan.");
      }
      resetForm();
      await refresh();
    } catch (e: any) {
      setErr(e?.message || "Gagal simpan collected");
    }
  }

  async function handleDelete(id: string | number | undefined) {
    if (!id) return;
    if (!confirm("Hapus item ini?")) return;
    try {
      await deleteCollected(id);
      await refresh();
    } catch (e: any) {
      alert(e?.message || "Gagal menghapus");
    }
  }

  return (
    <section className="mt-12">
      <SectionHeader title="Collected" desc="CRUD untuk collected (judul & image). Update saat ini hanya mengubah judul." />

      {/* List */}
      <div className="mb-10 overflow-x-auto rounded-lg border border-white/10">
        <table className="min-w-[800px] w-full border-collapse">
          <thead>
            <tr className="bg-white/5">
              <th className="p-3 text-left text-white/90">Gambar</th>
              <th className="p-3 text-left text-white/90">Judul</th>
              <th className="p-3 text-left text-white/90">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {(loading ? [] : items).map((c) => {
              const img = toAbs((c as any).image);
              return (
                <tr key={String(c.id)} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-3">{img ? <img src={img} alt="" className="h-12 w-12 object-cover rounded" /> : "—"}</td>
                  <td className="p-3">{c.title}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => populateForm(c)}
                        className="rounded border border-white/30 px-3 py-1 text-sm hover:bg-white/10"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="rounded border border-red-400/50 px-3 py-1 text-sm text-red-300 hover:bg-red-500/10"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && items.length === 0 && (
              <tr><td className="p-3 text-white/60" colSpan={3}>Belum ada data</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 rounded-xl border border-white/10 p-5">
        <h3 className="m-0 mb-2 text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28 }}>
          {editId ? "Edit Collected" : "Tambah Collected"}
        </h3>

        <Field label="Title (akan dikirim sebagai 'judul')">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" required />
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Dialog (opsional)">
            <input value={dialog} onChange={(e) => setDialog(e.target.value)} className="w-full rounded bg-[#121212] p-2 text-white" />
          </Field>
          <Field label="Image (opsional, hanya saat create)">
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} className="w-full rounded bg-[#121212] p-2 text-white file:mr-2 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-1" />
          </Field>
        </div>

        {err && <div className="text-red-400 text-sm">{err}</div>}

        <div className="mt-2 flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-[30px] border border-[#F5F5F5] px-6 py-2 text-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-black transition"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}
          >
            {editId ? "UPDATE" : "SIMPAN"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center rounded-[30px] border border-white/30 px-6 py-2 text-white hover:bg-white/10 transition"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}
            >
              BATAL
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

/* ===================== PAGE WRAPPER (dengan tabs) ===================== */
export default function AdminResearchShopCollectedPage() {
  const [active, setActive] = useState<TabKey>("research");

  const tabs: { key: TabKey; label: string }[] = useMemo(
    () => [
      { key: "research", label: "Research" },
      { key: "shop", label: "Shop / Products" },
      { key: "collected", label: "Collected" },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white" style={{ fontFamily: "Roboto, sans-serif" }}>
      {/* Heading */}
      <div className="mb-6">
        <h1 className="m-0 text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56 }}>
          CONTENT MANAGER
        </h1>
        <p className="m-0 mt-1 text-white/70 text-sm">
          Sinkron dengan YAML backend (hybrid). Research: list+create; Shop & Collected: full CRUD sesuai API saat ini.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2">
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(t.key)}
              className={[
                "rounded-[30px] border px-5 py-2 transition",
                isActive ? "border-white bg-white text-black" : "border-white/40 bg-transparent text-white hover:bg-white/10",
              ].join(" ")}
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: ".02em" }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      {active === "research" && <ResearchPanel />}
      {active === "shop" && <ShopPanel />}
      {active === "collected" && <CollectedPanel />}
    </div>
  );
}