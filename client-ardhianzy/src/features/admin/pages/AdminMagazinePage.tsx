// src/features/admin/pages/AdminMagazinePage.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import {
  adminFetchMagazines,
  adminDeleteMagazine,
  normalizeBackendHtml,
} from "@/lib/content/api";
import type { MagazineDTO } from "@/lib/content/types";

type StatusFilter = "ALL" | "PUBLISHED" | "DRAFT";

const STATUS_LABEL: Record<StatusFilter, string> = {
  ALL: "Semua Status",
  PUBLISHED: "Published",
  DRAFT: "Draft / Preview",
};

type MagazineRow = MagazineDTO & {
  is_published?: boolean | null;
};

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

const AdminMagazinePage: React.FC = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<MagazineRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");
  const [selected, setSelected] = useState<MagazineRow | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminFetchMagazines({ page: 1, limit: 1000 });
        if (cancelled) return;
        const casted = (data ?? []) as MagazineRow[];
        setRows(casted);
        setSelected(casted[0] ?? null);
      } catch (e: any) {
        if (!cancelled) {
          setError(
            e?.message || "Gagal memuat daftar magazines."
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
  }, []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((m) => {
      const title = (m.title ?? "").toLowerCase();
      const slug = (m.slug ?? "").toLowerCase();
      const desc = (m.meta_description ?? "").toLowerCase();
      const matchSearch =
        !q || title.includes(q) || slug.includes(q) || desc.includes(q);
      const isPublished = Boolean(
        (m as MagazineRow).is_published
      );
      const matchStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "PUBLISHED"
          ? isPublished
          : !isPublished;
      return matchSearch && matchStatus;
    });
  }, [rows, search, statusFilter]);

  useEffect(() => {
    if (!selected) return;
    const stillExists = filteredRows.some(
      (m) => m.id === selected.id
    );
    if (!stillExists) {
      setSelected(filteredRows[0] ?? null);
    }
  }, [filteredRows, selected]);

  const handleDelete = async (id: string) => {
    const ok = window.confirm(
      "Yakin ingin menghapus magazine ini? Tindakan ini tidak bisa dibatalkan."
    );
    if (!ok) return;

    try {
      await adminDeleteMagazine(id);
      setRows((prev) => prev.filter((m) => m.id !== id));
      setSelected((prev) => (prev && prev.id === id ? null : prev));
    } catch (e: any) {
      alert(e?.message || "Gagal menghapus magazine.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-7 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            ADMIN MAGAZINES
          </h1>
          <p className="text-sm text-neutral-400 mt-3 max-w-xl">
            Kelola magazines yang tampil di halaman Magazine. Setiap
            entri terhubung dengan deskripsi HTML dan satu file PDF.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.MAGAZINES_ADD)}
          className="px-5 py-2 rounded-full border border-white text-sm font-medium tracking-[0.15em]
                     hover:bg-white hover:text-black transition cursor-pointer"
        >
          + MAGAZINE BARU
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)]">
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl py-4 px-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
            <div className="flex gap-3">
              <select
                className="bg-black border border-zinc-700 rounded-full px-4 py-2 text-sm outline-none
                           focus:border-white cursor-pointer"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
              >
                {Object.entries(STATUS_LABEL).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Cari judul / slug..."
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
            <p className="text-sm text-neutral-400">
              Memuat magazines...
            </p>
          ) : error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : filteredRows.length === 0 ? (
            <p className="text-sm text-neutral-400">
              Belum ada magazine yang sesuai filter.
            </p>
          ) : (
            <div className="border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/80 text-neutral-400">
                  <tr>
                    <th className="text-center px-4 py-3 font-normal w-[40%]">
                      Judul
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[20%]">
                      PDF
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[20%]">
                      Updated
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[10%]">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[10%]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((m) => {
                    const isPublished = Boolean(
                      (m as MagazineRow).is_published
                    );
                    const isSelected = selected?.id === m.id;
                    return (
                      <tr
                        key={m.id}
                        className={`border-t border-zinc-800/70 ${
                          isSelected ? "bg-white/5" : "bg-transparent"
                        } hover:bg-white/5 transition cursor-pointer`}
                        onClick={() => setSelected(m)}
                      >
                        <td className="px-4 py-3 align-top">
                          <div className="font-medium text-sm">
                            {m.title ?? "-"}
                          </div>
                          <div className="text-xs text-neutral-500 truncate max-w-[210px]">
                            {m.meta_description ?? ""}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top text-xs text-neutral-400">
                          {m.pdf_filename
                            ? m.pdf_filename
                            : m.pdf_url
                            ? "PDF tersedia"
                            : "Belum ada PDF"}
                        </td>
                        <td className="px-4 py-3 align-top text-neutral-400 text-xs text-center">
                          {formatDateShort(m.updated_at ?? m.created_at)}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-[11px] ${
                              isPublished
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                                : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40"
                            }`}
                          >
                            {isPublished ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  ROUTES.ADMIN.MAGAZINES_EDIT(m.id)
                                );
                              }}
                              className="text-xs px-3 py-1 rounded-full border border-zinc-700 hover:bg-white hover:text-black transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(m.id);
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
            <p className="text-sm text-neutral-500">
              Pilih salah satu magazine di sebelah kiri untuk melihat
              preview deskripsi dan PDF-nya.
            </p>
          ) : (
            <div className="bg-black rounded-2xl border border-zinc-800/80 py-5 px-4 overflow-y-auto">
              {(() => {
                const m = selected;
                const isPublished = Boolean(
                  (m as MagazineRow).is_published
                );
                const htmlDescription = normalizeBackendHtml(
                  m.description ?? ""
                );

                return (
                  <>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                        {m.slug}
                      </span>
                      {m.created_at && (
                        <span className="text-[11px] text-neutral-500">
                          Dibuat {formatDateShort(m.created_at)}
                        </span>
                      )}
                      {m.updated_at && (
                        <span className="text-[11px] text-neutral-500">
                          • Update {formatDateShort(m.updated_at)}
                        </span>
                      )}
                      <span
                        className={`ml-auto text-[11px] px-2 py-1 rounded-full ${
                          isPublished
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                            : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40"
                        }`}
                      >
                        {isPublished ? "Published" : "Draft / Preview"}
                      </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-semibold mb-3">
                      {m.title ?? "Tanpa judul"}
                    </h1>

                    {m.meta_description && (
                      <p className="text-sm text-neutral-300 mb-4">
                        {m.meta_description}
                      </p>
                    )}

                    {m.image && (
                      <div className="mb-5 rounded-2xl overflow-hidden border border-zinc-800 max-h-64">
                        <img
                          src={m.image}
                          alt={m.title ?? "Magazine cover"}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    {htmlDescription && (
                      <div
                        className="card-typography prose prose-invert prose-sm max-w-none mb-4"
                        dangerouslySetInnerHTML={{
                          __html: htmlDescription || "—",
                        }}
                      />
                    )}

                    {m.megazine_isi && (
                      <div className="mt-2 mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs text-neutral-300">
                        <div className="font-medium mb-1">
                          Isi singkat (megazine_isi)
                        </div>
                        <p className="leading-relaxed whitespace-pre-line">
                          {m.megazine_isi}
                        </p>
                      </div>
                    )}

                    <div className="mt-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">
                          PDF Magazine
                        </p>
                        <p className="text-xs text-neutral-400 truncate max-w-xs">
                          {m.pdf_filename
                            ? m.pdf_filename
                            : m.pdf_url
                            ? m.pdf_url
                            : "Belum ada file PDF terunggah."}
                        </p>
                        {typeof m.pdf_size === "number" && (
                          <p className="text-[11px] text-neutral-500 mt-1">
                            ~{(m.pdf_size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                      {m.pdf_url && (
                        <a
                          href={m.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-4 py-2 rounded-full border border-white bg-white text-black tracking-[0.15em]
                                     hover:bg-transparent hover:text-white hover:border-white transition text-center"
                        >
                          BUKA PDF
                        </a>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMagazinePage;