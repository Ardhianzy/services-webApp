// src/features/admin/pages/AdminEditMonologuePage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import {
  adminGetMonologueById,
  adminUpdateMonologue,
  normalizeBackendHtml,
} from "@/lib/content/api";

type AdminMonologueForm = {
  title: string;
  slug: string;
  judul: string;
  dialog: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
};

const AdminEditMonologuePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<AdminMonologueForm | null>(
    null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] =
    useState<string | null>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreviewName, setPdfPreviewName] =
    useState<string | null>(null);
  const [existingPdfUrl, setExistingPdfUrl] =
    useState<string | null>(null);
  const [existingPdfSize, setExistingPdfSize] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof AdminMonologueForm>(
    key: K,
    value: AdminMonologueForm[K]
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  useEffect(() => {
    if (!id) {
      setError("ID monologue tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminGetMonologueById(id);
        if (cancelled) return;
        const raw: any = data;

        const mapped: AdminMonologueForm = {
          title: raw.title ?? "",
          slug: raw.slug ?? "",
          judul: raw.judul ?? "",
          dialog: normalizeBackendHtml(raw.dialog ?? ""),
          metaTitle: raw.meta_title ?? "",
          metaDescription: raw.meta_description ?? "",
          isPublished: Boolean(raw.is_published),
        };

        setForm(mapped);

        if (typeof raw.image === "string" && raw.image) {
          setImagePreviewUrl(raw.image);
        }

        setExistingPdfUrl(raw.pdf_url ?? null);
        setExistingPdfSize(
          typeof raw.pdf_size === "number" ? raw.pdf_size : null
        );
        setPdfPreviewName(
          raw.pdf_filename ?? raw.pdf_url ?? null
        );
      } catch (e: any) {
        if (!cancelled) {
          setError(
            e?.message ||
              "Gagal memuat data monologue untuk di-edit."
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

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
  };

  const handlePdfChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0] ?? null;
    setPdfFile(file);
    setPdfPreviewName(file ? file.name : existingPdfUrl);
  };

  const handleSubmit = async () => {
    if (!id || !form) return;

    if (!form.title || !form.dialog) {
      setError("Minimal isi judul dan dialog (HTML).");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const fd = new FormData();

      fd.append("title", form.title);
      if (form.slug) fd.append("slug", form.slug);
      if (form.judul) fd.append("judul", form.judul);
      fd.append("dialog", form.dialog);
      if (form.metaTitle) fd.append("meta_title", form.metaTitle);
      if (form.metaDescription)
        fd.append("meta_description", form.metaDescription);
      fd.append("is_published", String(form.isPublished));

      if (imageFile) {
        fd.append("image", imageFile);
      }
      if (pdfFile) {
        fd.append("pdf", pdfFile);
      }

      await adminUpdateMonologue(id, fd);
      navigate(ROUTES.ADMIN.MONOLOGUES);
    } catch (e: any) {
      setError(
        e?.message ||
          "Gagal menyimpan perubahan monologue. Cek kembali data yang kamu ubah."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-10 py-8 flex items-center justify-center">
        <p className="text-sm text-neutral-400">
          Memuat monologue untuk di-edit...
        </p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-black text-white px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-[0.15em]">
            EDIT MONOLOGUE
          </h1>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.MONOLOGUES)}
            className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                       hover:bg-white hover:text-black transition cursor-pointer"
          >
            KEMBALI KE LIST
          </button>
        </div>
        <p className="text-sm text-red-400">
          {error || "Monologue tidak ditemukan."}
        </p>
      </div>
    );
  }

  const normalizedDialogPreview = normalizeBackendHtml(
    form.dialog || "<p>Dialog HTML akan tampil di sini...</p>"
  );

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            EDIT MONOLOGUE
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Perbarui konten monologue dan file PDF yang terhubung.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.MONOLOGUES)}
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
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              JUDUL TAMPIL (OPSIONAL)
            </label>
            <input
              type="text"
              className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                         focus:border-white"
              value={form.judul}
              onChange={(e) =>
                updateField("judul", e.target.value)
              }
            />
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
              DIALOG (HTML)
            </label>
            <textarea
              className="bg-black border border-zinc-700 rounded-2xl px-3 py-2 text-xs outline-none
                         focus:border-white min-h-[220px] font-mono leading-relaxed"
              value={form.dialog}
              onChange={(e) =>
                updateField("dialog", e.target.value)
              }
            />
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
              PDF FILE
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
                ? `File aktif: ${pdfPreviewName}`
                : existingPdfUrl
                ? `Menggunakan PDF lama: ${existingPdfUrl}`
                : "Belum ada file PDF diunggah."}
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
            LIVE PREVIEW
          </h2>
          <div className="bg-black rounded-2xl border border-zinc-800 p-6 h-full overflow-y-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
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
              {form.title || "Judul monologue"}
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
              className="card-typography prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: normalizedDialogPreview,
              }}
            />

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs text-neutral-300">
              <div className="font-medium mb-1">
                PDF Monologue (Preview)
              </div>
              <div>
                {pdfPreviewName
                  ? pdfPreviewName
                  : existingPdfUrl
                  ? existingPdfUrl
                  : "Belum ada file PDF diunggah."}
              </div>
              {typeof existingPdfSize === "number" && (
                <div className="text-[11px] text-neutral-500 mt-1">
                  ~{(existingPdfSize / 1024).toFixed(1)} KB
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditMonologuePage;