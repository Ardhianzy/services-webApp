// src/features/admin/pages/AdminYoutubePage.tsx
import { useEffect, useMemo, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import {
  adminFetchYoutubeLatest,
  adminDeleteYoutube,
  normalizeBackendHtml,
} from "@/lib/content/api";
import type { LatestYoutubeDTO } from "@/lib/content/types";

function formatDateShort(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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

function snippetTextFromHtml(raw?: string | null, maxLen = 120): string {
  if (!raw) return "";
  const html = normalizeBackendHtml(toHtmlDescription(raw));
  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return "";
  if (plain.length <= maxLen) return plain;
  return plain.slice(0, maxLen).trimEnd() + "…";
}

const AdminYoutubePage: FC = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState<LatestYoutubeDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LatestYoutubeDTO | null>(null);

  useEffect(() => {
    const ctrl = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await adminFetchYoutubeLatest({ limit: 200, signal: ctrl.signal });

        if (cancelled) return;
        const safe = Array.isArray(data) ? data : [];
        setRows(safe);
        setSelected(safe[0] ?? null);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Gagal memuat daftar Youtube.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      ctrl.abort();
    };
  }, []);

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const ta = Date.parse(String((a as any).created_at ?? ""));
      const tb = Date.parse(String((b as any).created_at ?? ""));
      const na = Number.isNaN(ta) ? 0 : ta;
      const nb = Number.isNaN(tb) ? 0 : tb;
      return nb - na; // terbaru dulu
    });
    return copy;
  }, [rows]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return sortedRows.filter((v) => {
      const title = String((v as any).title ?? "").toLowerCase();
      const url = String((v as any).url ?? "").toLowerCase();
      const desc = String((v as any).description ?? "").toLowerCase();

      const matchSearch = !q || title.includes(q) || url.includes(q) || desc.includes(q);
      return matchSearch;
    });
  }, [sortedRows, search]);

  useEffect(() => {
    if (!selected) return;
    const stillExists = filteredRows.some((x) => x.id === selected.id);
    if (!stillExists) setSelected(filteredRows[0] ?? null);
  }, [filteredRows, selected]);

  const handleDelete = async (id: string) => {
    const ok = window.confirm(
      "Yakin ingin menghapus record Youtube ini? Tindakan ini tidak bisa dibatalkan."
    );
    if (!ok) return;

    try {
      await adminDeleteYoutube(id);
      setRows((prev) => prev.filter((x) => x.id !== id));
      setSelected((prev) => (prev && prev.id === id ? null : prev));
    } catch (e: any) {
      alert(e?.message || "Gagal menghapus record Youtube.");
    }
  };

  const selectedUrl = normalizeUrl(selected?.url);
  const selectedVid = selectedUrl ? extractYouTubeId(selectedUrl) : "";
  const selectedEmbed = selectedVid ? `https://www.youtube.com/embed/${selectedVid}` : "";

  const selectedDescHtml = selected?.description
    ? normalizeBackendHtml(toHtmlDescription(selected.description))
    : "";

  return (
    <div className="min-h-screen bg-black text-white px-7 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">ADMIN YOUTUBE (LAST VIDEO)</h1>
          <p className="text-sm text-neutral-400 mt-3 max-w-xl">Kelola daftar video Youtube.</p>
        </div>

        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.YOUTUBE_ADD)}
          className="px-5 py-2 rounded-full border border-white text-sm font-medium tracking-[0.15em]
                     hover:bg-white hover:text-black transition cursor-pointer"
        >
          + YOUTUBE BARU
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)]">
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl py-4 px-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end mb-5">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Cari judul / url / deskripsi..."
                className="w-full bg-black border border-zinc-700 rounded-full pl-9 pr-3 py-2 text-sm outline-none
                           placeholder:text-zinc-500 focus:border-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
                🔍
              </span>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-neutral-400">Memuat Youtube...</p>
          ) : error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : filteredRows.length === 0 ? (
            <p className="text-sm text-neutral-400">Belum ada video yang sesuai pencarian.</p>
          ) : (
            <div className="border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/80 text-neutral-400">
                  <tr>
                    <th className="text-center px-4 py-3 font-normal w-[58%]">Judul</th>
                    <th className="text-center px-4 py-3 font-normal w-[20%]">Tanggal</th>
                    <th className="text-center px-4 py-3 font-normal w-[22%]">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRows.map((v) => {
                    const isSelected = selected?.id === v.id;

                    return (
                      <tr
                        key={v.id}
                        className={`border-t border-zinc-800/70 ${
                          isSelected ? "bg-white/5" : "bg-transparent"
                        } hover:bg-white/5 transition cursor-pointer`}
                        onClick={() => setSelected(v)}
                      >
                        <td className="px-4 py-3 align-top">
                          <div className="font-medium text-sm">{v.title ?? "-"}</div>
                          <div className="text-xs text-neutral-500 truncate max-w-[420px]">
                            {snippetTextFromHtml(v.description, 110)}
                          </div>
                          <div className="text-[11px] text-neutral-500 truncate max-w-[420px] mt-1">
                            {normalizeUrl(v.url)}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-center align-top text-xs text-neutral-300">
                          {formatDateShort(v.created_at)}
                        </td>

                        <td className="px-4 py-3 align-top text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(ROUTES.ADMIN.YOUTUBE_EDIT(String(v.id)));
                              }}
                              className="text-xs px-3 py-1 rounded-full border border-zinc-700 hover:bg-white hover:text-black transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(String(v.id));
                              }}
                              className="text-xs px-3 py-1 rounded-full border border-red-500/60 text-red-300 hover:bg-red-500 hover:text-white transition cursor-pointer"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl py-6 px-4 overflow-hidden flex flex-col">
          <h2 className="text-sm font-medium tracking-[0.15em] text-neutral-400 mb-4">
            LIVE PREVIEW (ADMIN)
          </h2>

          {!selected ? (
            <p className="text-sm text-neutral-500">Pilih salah satu record Youtube untuk melihat preview.</p>
          ) : (
            <div className="bg-black rounded-2xl border border-zinc-800/80 py-5 px-4 overflow-y-auto">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {selected.created_at && (
                  <span className="text-[11px] text-neutral-500">
                    Dibuat: {formatDateShort(selected.created_at)}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selected.title ?? "Judul video"}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-300 mb-4">
                <a
                  href={selectedUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-full border border-zinc-700 hover:bg-white hover:text-black transition"
                  onClick={(e) => {
                    if (!selectedUrl) e.preventDefault();
                  }}
                >
                  Open URL
                </a>
              </div>

              {selectedEmbed ? (
                <div className="mb-5 rounded-2xl overflow-hidden border border-zinc-800">
                  <div className="aspect-video w-full bg-black">
                    <iframe
                      title="Youtube Preview"
                      src={selectedEmbed}
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

              {selectedDescHtml && (
                <div className="prose prose-invert prose-sm max-w-none mb-4">
                  <div dangerouslySetInnerHTML={{ __html: selectedDescHtml }} />
                </div>
              )}

              {!selectedDescHtml && (
                <p className="text-sm text-neutral-500">
                  Deskripsi kosong. Kamu bisa isi HTML sederhana atau teks biasa.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="sr-only">
        <a href={ROUTES.ADMIN.YOUTUBE}>Back</a>
      </div>
    </div>
  );
};

export default AdminYoutubePage;