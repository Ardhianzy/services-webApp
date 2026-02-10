// src/features/admin/pages/AdminAddMagazinePage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { adminCreateMagazine, normalizeBackendHtml } from "@/lib/content/api";

type AdminMagazineForm = {
  title: string;
  slug: string;
  descriptionHtml: string;
  megazineIsi: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  isPublished: boolean;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const AdminAddMagazinePage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<AdminMagazineForm>({
    title: "",
    slug: "",
    descriptionHtml: "",
    megazineIsi: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    isPublished: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] =
    useState<string | null>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreviewName, setPdfPreviewName] =
    useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const updateField = <K extends keyof AdminMagazineForm>(
    key: K,
    value: AdminMagazineForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "title" && !prev.slug
        ? { slug: slugify(String(value)) }
        : null),
    }));
  };

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handlePdfChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0] ?? null;
    setPdfFile(file);
    setPdfPreviewName(file ? file.name : null);
  };

  const handleSubmit = async (publish: boolean) => {
    if (!form.title || !form.descriptionHtml || !pdfFile) {
      setError(
        "Minimal isi judul, description (HTML), dan unggah file PDF."
      );
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      if (form.slug) fd.append("slug", form.slug);
      if (form.descriptionHtml)
        fd.append("description", form.descriptionHtml);
      if (form.megazineIsi)
        fd.append("megazine_isi", form.megazineIsi);
      if (form.metaTitle) fd.append("meta_title", form.metaTitle);
      if (form.metaDescription)
        fd.append("meta_description", form.metaDescription);
      if (form.keywords) fd.append("keywords", form.keywords);
      fd.append("is_published", String(publish));

      if (imageFile) {
        fd.append("image", imageFile);
      }

      fd.append("pdf", pdfFile);

      await adminCreateMagazine(fd);
      navigate(ROUTES.ADMIN.MAGAZINES);
    } catch (e: any) {
      setError(
        e?.message ||
          "Gagal menyimpan magazine. Cek kembali data yang kamu isi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const normalizedDescriptionPreview = normalizeBackendHtml(
    form.descriptionHtml ||
      "<p>Description HTML akan tampil di sini...</p>"
  );

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            NEW MAGAZINE
          </h1>
          <p className="text-sm text-neutral-400 mt-3 max-w-xl">
            Buat magazine baru untuk halaman Magazine. Deskripsi diisi
            dalam format <span className="font-mono">&lt;HTML&gt;</span>{" "}
            dan terhubung dengan satu file PDF.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.MAGAZINES)}
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
                onChange={(e) =>
                  updateField("title", e.target.value)
                }
                placeholder="Judul magazine"
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
                onChange={(e) =>
                  updateField("slug", e.target.value)
                }
                placeholder="rise-of-the-soul"
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
                placeholder="rise of the soul"
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
                placeholder="Issue 1 Rise of the Soul adalah panduan reflektif..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              KEYWORDS (OPSIONAL, PISAHKAN KOMA)
            </label>
            <input
              type="text"
              className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                         focus:border-white"
              value={form.keywords}
              onChange={(e) =>
                updateField("keywords", e.target.value)
              }
              placeholder="soul, krisis-modern, refleksi..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              DESCRIPTION (HTML)
            </label>
            <textarea
              className="bg-black border border-zinc-700 rounded-2xl px-3 py-2 text-xs outline-none
                         focus:border-white min-h-[220px] font-mono leading-relaxed"
              value={form.descriptionHtml}
              onChange={(e) =>
                updateField("descriptionHtml", e.target.value)
              }
              placeholder={`<p>Issue 1 Rise of the Soul adalah panduan reflektif...</p>\n<p>Paragraf kedua...</p>`}
            />
            <p className="text-[11px] text-neutral-500">
              *Masukkan HTML utuh (&lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, dll).
              Di sisi user, HTML ini akan dirender sama persis
              (setelah normalisasi dari backend).
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              MEGAZINE_ISI / TEKS PENDUKUNG
            </label>
            <textarea
              className="bg-black border border-zinc-700 rounded-2xl px-3 py-2 text-xs outline-none
                         focus:border-white min-h-[120px] leading-relaxed"
              value={form.megazineIsi}
              onChange={(e) =>
                updateField("megazineIsi", e.target.value)
              }
              placeholder="Be mindful of your breath. Inhale… exhale…"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              COVER IMAGE (OPSIONAL)
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
              PDF FILE (WAJIB)
            </label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="text-xs text-neutral-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-full
                         file:border file:border-zinc-600 file:bg-zinc-900 file:text-xs
                         file:hover:bg-zinc-800 cursor-pointer"
            />
            <p className="text-[11px] text-neutral-500">
              {pdfPreviewName
                ? `File terpilih: ${pdfPreviewName}`
                : "Belum ada file PDF dipilih."}
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-400 mt-1">{error}</p>
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
              <span>Publish ke user begitu disimpan</span>
            </label>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  updateField("isPublished", false);
                  void handleSubmit(false);
                }}
                className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                           hover:bg-zinc-800 disabled:opacity-50 cursor-pointer"
              >
                SAVE AS DRAFT / PREVIEW
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  updateField("isPublished", true);
                  void handleSubmit(true);
                }}
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
            LIVE PREVIEW
          </h2>
          <div className="bg-black rounded-2xl border border-zinc-800 p-6 h-full overflow-y-auto"><div className="flex flex-wrap items-center gap-2 mb-3">
              {form.slug && (
                <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                  {form.slug}
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

            <h1 className="text-2xl md:text-3xl font-semibold mb-3">
              {form.title || "Judul magazine akan tampil di sini"}
            </h1>

            {form.metaDescription && (
              <p className="text-sm text-neutral-300 mb-4">
                {form.metaDescription}
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
              className="card-typography prose prose-invert prose-sm max-w-none mb-4"
              dangerouslySetInnerHTML={{
                __html: normalizedDescriptionPreview,
              }}
            />

            {form.megazineIsi && (
              <div className="mt-2 mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs text-neutral-300">
                <div className="font-medium mb-1">
                  Isi singkat (megazine_isi)
                </div>
                <p className="leading-relaxed whitespace-pre-line">
                  {form.megazineIsi}
                </p>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs text-neutral-300">
              <div className="font-medium mb-1">
                PDF Magazine (Preview)
              </div>
              <div>
                {pdfPreviewName
                  ? pdfPreviewName
                  : "Belum ada file PDF dipilih."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddMagazinePage;