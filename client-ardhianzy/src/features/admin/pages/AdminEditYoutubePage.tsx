// src/features/admin/pages/AdminEditYoutubePage.tsx
import { useEffect, useMemo, useState, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import {
  adminGetYoutubeById,
  adminUpdateYoutube,
  adminDeleteYoutube,
  normalizeBackendHtml,
} from "@/lib/content/api";
import type { LatestYoutubeDTO } from "@/lib/content/types";

type AdminYoutubeForm = {
  title: string;
  url: string;
  description: string;
};

function normalizeUrl(raw?: string): string {
  const url = (raw ?? "").trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (/^youtu\.be\//i.test(url)) return `https://${url}`;
  if (/^www\./i.test(url)) return `https://${url}`;
  return url;
}

function extractYouTubeId(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v") || "";
    if (u.hostname === "youtu.be") return u.pathname.replace("/", "");
  } catch {}
  const m = url.match(/v=([A-Za-z0-9_\-]+)/);
  return m?.[1] ?? "";
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function toHtmlDescription(raw?: string | null): string {
  const s = String(raw ?? "");
  if (/<[a-z][\s\S]*>/i.test(s)) return s;
  const safe = escapeHtml(s).replace(/\r?\n/g, "<br/>");
  return safe.trim() ? `<p>${safe}</p>` : "";
}

function formatDateShort(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

const AdminEditYoutubePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [raw, setRaw] = useState<LatestYoutubeDTO | null>(null);
  const [form, setForm] = useState<AdminYoutubeForm | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof AdminYoutubeForm>(key: K, value: AdminYoutubeForm[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  useEffect(() => {
    if (!id) {
      setError("ID Youtube tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const ctrl = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await adminGetYoutubeById(id, { signal: ctrl.signal, limit: 200 });

        if (cancelled) return;

        setRaw(data);
        setForm({
          title: (data as any).title ?? "",
          url: (data as any).url ?? "",
          description: (data as any).description ?? "",
        });
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Gagal memuat data Youtube untuk di-edit.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, [id]);

  const handleSubmit = async () => {
    if (!id || !form) return;

    if (!form.title.trim() || !form.url.trim()) {
      setError("Minimal isi judul (title) dan url Youtube.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await adminUpdateYoutube(id, {
        title: form.title.trim(),
        url: form.url.trim(),
        description: form.description ?? "",
      });

      navigate(ROUTES.ADMIN.YOUTUBE);
    } catch (e: any) {
      setError(e?.message || "Gagal menyimpan perubahan Youtube.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const ok = window.confirm(
      "Yakin ingin menghapus record Youtube ini? Tindakan ini tidak bisa dibatalkan."
    );
    if (!ok) return;

    try {
      await adminDeleteYoutube(id);
      navigate(ROUTES.ADMIN.YOUTUBE);
    } catch (e: any) {
      alert(e?.message || "Gagal menghapus record Youtube.");
    }
  };

  const urlNorm = normalizeUrl(form?.url);
  const vid = urlNorm ? extractYouTubeId(urlNorm) : "";
  const embed = vid ? `https://www.youtube.com/embed/${vid}` : "";

  const previewDesc = useMemo(() => {
    const html = normalizeBackendHtml(toHtmlDescription(form?.description || ""));
    return html;
  }, [form?.description]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-10 py-8 flex items-center justify-center">
        <p className="text-sm text-neutral-400">Memuat Youtube untuk di-edit...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-black text-white px-10 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-[0.15em]">EDIT YOUTUBE</h1>
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN.YOUTUBE)}
            className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                       hover:bg-white hover:text-black transition cursor-pointer"
          >
            KEMBALI KE LIST
          </button>
        </div>
        <p className="text-sm text-red-400">{error || "Youtube tidak ditemukan."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">EDIT YOUTUBE (LAST VIDEO)</h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Perbarui judul, url, dan deskripsi. Deskripsi mendukung HTML sederhana atau teks biasa.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.YOUTUBE)}
          className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                     hover:bg-white hover:text-black transition cursor-pointer"
        >
          KEMBALI KE LIST
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)]">
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            {raw?.created_at && (
              <span className="text-[11px] text-neutral-500">
                Dibuat: {formatDateShort(raw.created_at)}
              </span>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">TITLE</label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-white"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">YOUTUBE URL</label>
              <input
                type="text"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-white font-mono"
                value={form.url}
                onChange={(e) => updateField("url", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-neutral-400 tracking-[0.15em]">DESCRIPTION (HTML / TEXT)</label>
            <textarea
              className="bg-black border border-zinc-700 rounded-2xl px-3 py-2 text-xs outline-none
                         min-h-[140px] resize-vertical focus:border-white font-mono leading-relaxed"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="<p>Deskripsi...</p> atau teks biasa"
            />
          </div>

          {error && <p className="text-sm text-red-400 mt-1">{error}</p>}

          <div className="flex flex-wrap items-center gap-3 justify-end pt-3 border-t border-zinc-800 mt-2">
            <button
              type="button"
              disabled={submitting}
              onClick={handleDelete}
              className="px-4 py-2 rounded-full border border-red-500/60 text-red-300 text-xs tracking-[0.15em]
                         hover:bg-red-500 hover:text-white disabled:opacity-50 cursor-pointer"
            >
              DELETE
            </button>

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

        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 overflow-hidden">
          <h2 className="text-sm font-medium tracking-[0.15em] text-neutral-400 mb-4">LIVE PREVIEW</h2>

          <div className="bg-black rounded-2xl border border-zinc-800 p-6 h-full overflow-y-auto">
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">{form.title || "Judul video"}</h1>

            {urlNorm && (
              <a
                href={urlNorm}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300 hover:bg-white hover:text-black transition mb-4"
              >
                Open URL
              </a>
            )}

            {embed ? (
              <div className="mb-5 rounded-2xl overflow-hidden border border-zinc-800">
                <div className="aspect-video w-full bg-black">
                  <iframe
                    title="Youtube Preview"
                    src={embed}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <div className="mb-5 rounded-2xl overflow-hidden border border-zinc-800 p-4 text-sm text-neutral-500">
                URL belum valid untuk preview embed.
              </div>
            )}

            {form.description ? (
              <div className="prose prose-invert prose-sm max-w-none mb-4">
                <div dangerouslySetInnerHTML={{ __html: previewDesc }} />
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Deskripsi kosong.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditYoutubePage;