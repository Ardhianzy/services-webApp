// src/features/admin/pages/AdminEditToTPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import {
  adminGetToTById,
  adminUpdateToT,
  normalizeBackendHtml,
} from "@/lib/content/api";

type AdminToTForm = {
  philosofer: string;
  slug: string;
  geoorigin: string;
  detailLocation: string;
  years: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  isPublished: boolean;
};

const AdminEditToTPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<AdminToTForm | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof AdminToTForm>(
    key: K,
    value: AdminToTForm[K]
  ) => {
    setForm((prev) =>
      prev ? { ...prev, [key]: value } : prev
    );
  };

  useEffect(() => {
    if (!id) {
      setError("ID ToT tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminGetToTById(id);
        if (cancelled) return;

        const raw: any = data;
        const mapped: AdminToTForm = {
          philosofer: raw.philosofer ?? "",
          slug: raw.slug ?? "",
          geoorigin: raw.geoorigin ?? "",
          detailLocation: raw.detail_location ?? "",
          years: raw.years ?? "",
          metaTitle: raw.meta_title ?? "",
          metaDescription: normalizeBackendHtml(
            raw.meta_description ?? ""
          ),
          keywords: raw.keywords ?? "",
          isPublished: Boolean(raw.is_published),
        };

        setForm(mapped);

        if (typeof raw.image === "string" && raw.image) {
          setImagePreviewUrl(raw.image);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(
            e?.message ||
              "Gagal memuat data ToT untuk di-edit."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
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

  const handleSubmit = async () => {
    if (!id || !form) return;

    if (!form.philosofer || !form.geoorigin || !form.years) {
      setError(
        "Minimal isi nama tokoh, geo origin, dan periode tahun (years)."
      );
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const fd = new FormData();

      fd.append("philosofer", form.philosofer);
      if (form.slug) fd.append("slug", form.slug);
      if (form.geoorigin) fd.append("geoorigin", form.geoorigin);
      if (form.detailLocation)
        fd.append("detail_location", form.detailLocation);
      if (form.years) fd.append("years", form.years);
      if (form.metaTitle) fd.append("meta_title", form.metaTitle);
      if (form.metaDescription)
        fd.append("meta_description", form.metaDescription);
      if (form.keywords) fd.append("keywords", form.keywords);
      fd.append("is_published", String(form.isPublished));

      if (imageFile) {
        fd.append("image", imageFile);
      }

      await adminUpdateToT(id, fd);
      navigate(ROUTES.ADMIN.TOT_LIST);
    } catch (e: any) {
      setError(
        e?.message ||
          "Gagal menyimpan perubahan ToT. Cek kembali data yang kamu ubah."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-10 py-8 flex items-center justify-center">
        <p className="text-sm text-neutral-400">
          Memuat ToT untuk di-edit...
        </p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-black text-white px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-[0.15em]">
            EDIT ToT
          </h1>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.TOT_LIST)}
            className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                       hover:bg-white hover:text-black transition cursor-pointer"
          >
            KEMBALI KE LIST
          </button>
        </div>
        <p className="text-sm text-red-400">
          {error || "ToT tidak ditemukan."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            EDIT TIMELINE OF THOUGHT (ToT)
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Perbarui data tokoh, asal geografis, lokasi, periode tahun, dan
            status publikasi ToT.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.TOT_LIST)}
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
                PHILOSOFER NAME
              </label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                           focus:border-white"
                value={form.philosofer}
                onChange={(e) =>
                  updateField("philosofer", e.target.value)
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                GEO ORIGIN
              </label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                           focus:border-white"
                value={form.geoorigin}
                onChange={(e) =>
                  updateField("geoorigin", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                DETAIL LOCATION
              </label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                           focus:border-white"
                value={form.detailLocation}
                onChange={(e) =>
                  updateField("detailLocation", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 max-w-xs">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              YEARS (PERIODE)
            </label>
            <input
              type="text"
              className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                         focus:border-white"
              value={form.years}
              onChange={(e) =>
                updateField("years", e.target.value)
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2 md:col-span-1">
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
            <div className="flex flex-col gap-2 md:col-span-1">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                META DESCRIPTION (HTML)
              </label>
              <textarea
                className="bg-black border border-zinc-700 rounded-2xl px-3 py-2 text-xs outline-none
                           min-h-[80px] resize-vertical focus:border-white font-mono leading-relaxed"
                value={form.metaDescription}
                onChange={(e) =>
                  updateField(
                    "metaDescription",
                    e.target.value
                  )
                }
                placeholder="<p>Deskripsi singkat tokoh...</p>"
              />
              <p className="text-[11px] text-neutral-500">
                *Dukung HTML sederhana (&lt;p&gt;, &lt;strong&gt;,
                &lt;em&gt;, &lt;ul&gt;, dll). Di sisi user akan
                dirender apa adanya setelah normalisasi.
              </p>
            </div>
            <div className="flex flex-col gap-2 md:col-span-1">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                KEYWORDS (OPSIONAL)
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

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">
              PORTRAIT IMAGE
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
                  alt="Preview ToT"
                  className="w-full h-56 object-cover"
                />
              </div>
            )}
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
                  updateField(
                    "isPublished",
                    e.target.checked
                  )
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
                {form.isPublished
                  ? "Published"
                  : "Draft / Preview"}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
              {form.philosofer || "Nama tokoh"}
            </h1>

            <div className="flex flex-wrap gap-2 text-[11px] text-neutral-300 mb-3">
              {form.geoorigin && (
                <span className="px-2 py-1 rounded-full border border-zinc-700">
                  Origin: {form.geoorigin}
                </span>
              )}
              {form.detailLocation && (
                <span className="px-2 py-1 rounded-full border border-zinc-700">
                  Lokasi: {form.detailLocation}
                </span>
              )}
              {form.years && (
                <span className="px-2 py-1 rounded-full border border-zinc-700">
                  Years: {form.years}
                </span>
              )}
            </div>

            {form.metaDescription && (
              <div className="prose prose-invert prose-sm max-w-none mb-4">
                <div
                  dangerouslySetInnerHTML={{
                    __html: normalizeBackendHtml(
                      form.metaDescription
                    ),
                  }}
                />
              </div>
            )}

            {imagePreviewUrl && (
              <div className="mb-6 rounded-2xl overflow-hidden border border-zinc-800">
                <img
                  src={imagePreviewUrl}
                  alt="Preview ToT"
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            <div className="mt-4 text-[11px] text-neutral-500 space-y-1">
              {!form.metaDescription && (
                <p>
                  Meta description kosong. Kamu bisa mengisinya
                  untuk ringkasan singkat tokoh dan kebutuhan SEO.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditToTPage;