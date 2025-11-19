// src/features/admin/pages/AdminToTPage.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { adminFetchToT, adminDeleteToT } from "@/lib/content/api";
import type { ToTDTO } from "@/lib/content/types";

type StatusFilter = "ALL" | "PUBLISHED" | "DRAFT";

const STATUS_LABEL: Record<StatusFilter, string> = {
  ALL: "Semua Status",
  PUBLISHED: "Published",
  DRAFT: "Draft / Preview",
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

const AdminToTPage: React.FC = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState<ToTDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selected, setSelected] = useState<ToTDTO | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminFetchToT();
        if (cancelled) return;
        setRows(data);
        setSelected(data[0] ?? null);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Gagal memuat daftar ToT.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((t) => {
      const name = (t.philosofer ?? "").toLowerCase();
      const origin = (t.geoorigin ?? "").toLowerCase();
      const location = (t.detail_location ?? "").toLowerCase();
      const years = (t.years ?? "").toLowerCase();
      const slug = (t.slug ?? "").toLowerCase();
      const metaTitle = (t.meta_title ?? "").toLowerCase();
      const metaDescription = (t.meta_description ?? "").toLowerCase();

      const matchSearch =
        !q ||
        name.includes(q) ||
        origin.includes(q) ||
        location.includes(q) ||
        years.includes(q) ||
        slug.includes(q) ||
        metaTitle.includes(q) ||
        metaDescription.includes(q);

      const isPublished = Boolean(t.is_published);
      const matchStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "PUBLISHED"
          ? isPublished
          : !isPublished;

      return matchSearch && matchStatus;
    });
  }, [rows, search, statusFilter]);

  // Pastikan selected tetap valid setelah filter berubah
  useEffect(() => {
    if (!selected) return;
    const stillExists = filteredRows.some((t) => t.id === selected.id);
    if (!stillExists) {
      setSelected(filteredRows[0] ?? null);
    }
  }, [filteredRows, selected]);

  const handleDelete = async (id: string) => {
    const ok = window.confirm(
      "Yakin ingin menghapus ToT ini? Tindakan ini tidak bisa dibatalkan."
    );
    if (!ok) return;

    try {
      await adminDeleteToT(id);
      setRows((prev) => prev.filter((t) => t.id !== id));
      setSelected((prev) => (prev && prev.id === id ? null : prev));
    } catch (e: any) {
      alert(e?.message || "Gagal menghapus ToT.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-7 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            ADMIN TIMELINE OF THOUGHT
          </h1>
          <p className="text-sm text-neutral-400 mt-3 max-w-xl">
            Kelola entri Timeline of Thought (ToT): tokoh filsafat, asal
            geografis, lokasi detail, periode tahun, dan status publikasi
            (Published / Draft / Preview).
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.TOT_ADD)}
          className="px-5 py-2 rounded-full border border-white text-sm font-medium tracking-[0.15em]
                     hover:bg-white hover:text-black transition cursor-pointer"
        >
          + ToT BARU
        </button>
      </div>

      {/* Layout: kiri = list, kanan = preview */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)]">
        {/* KIRI: LIST */}
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl py-4 px-3">
          {/* Filter bar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
            <div className="flex gap-3">
              <select
                className="bg-black border border-zinc-700 rounded-full px-4 py-2 text-sm outline-none
                           focus:border-white cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              >
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Cari tokoh / asal / slug..."
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

          {/* Isi list */}
          {loading ? (
            <p className="text-sm text-neutral-400">Memuat ToT...</p>
          ) : error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : filteredRows.length === 0 ? (
            <p className="text-sm text-neutral-400">
              Belum ada ToT yang sesuai filter.
            </p>
          ) : (
            <div className="border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/80 text-neutral-400">
                  <tr>
                    <th className="text-center px-4 py-3 font-normal w-[30%]">
                      Tokoh
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[20%]">
                      Asal & Lokasi
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[15%]">
                      Periode
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[15%]">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[20%]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((t) => {
                    const isPublished = Boolean(t.is_published);
                    const isSelected = selected?.id === t.id;
                    return (
                      <tr
                        key={t.id}
                        className={`border-t border-zinc-800/70 ${
                          isSelected ? "bg-white/5" : "bg-transparent"
                        } hover:bg-white/5 transition cursor-pointer`}
                        onClick={() => setSelected(t)}
                      >
                        <td className="px-4 py-3 align-top">
                          <div className="font-medium text-sm">
                            {t.philosofer ?? "-"}
                          </div>
                          <div className="text-xs text-neutral-500 truncate max-w-[190px]">
                            {t.meta_description ?? ""}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top text-xs text-neutral-300">
                          <div>{t.geoorigin ?? "-"}</div>
                          <div className="text-[11px] text-neutral-500 truncate max-w-[150px]">
                            {t.detail_location ?? ""}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top text-center text-xs text-neutral-300">
                          {t.years ?? "-"}
                        </td>
                        <td className="px-4 py-3 align-top text-center">
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
                                navigate(ROUTES.ADMIN.TOT_EDIT(t.id));
                              }}
                              className="text-xs px-3 py-1 rounded-full border border-zinc-700 hover:bg-white hover:text-black transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(t.id);
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

        {/* KANAN: PREVIEW */}
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl py-6 px-4 overflow-hidden flex flex-col">
          <h2 className="text-sm font-medium tracking-[0.15em] text-neutral-400 mb-4">
            LIVE PREVIEW (ADMIN)
          </h2>

          {!selected ? (
            <p className="text-sm text-neutral-500">
              Pilih salah satu ToT di sebelah kiri untuk melihat preview kartu
              tokoh dan metadata-nya.
            </p>
          ) : (
            <div className="bg-black rounded-2xl border border-zinc-800/80 py-5 px-4 overflow-y-auto">
              {(() => {
                const t = selected;
                const isPublished = Boolean(t.is_published);

                return (
                  <>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                        {t.slug || "tanpa-slug"}
                      </span>
                      {t.created_at && (
                        <span className="text-[11px] text-neutral-500">
                          Dibuat: {formatDateShort(t.created_at)}
                        </span>
                      )}
                      {t.updated_at && (
                        <span className="text-[11px] text-neutral-500">
                          • Update {formatDateShort(t.updated_at)}
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

                    <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                      {t.philosofer ?? "Nama tokoh"}
                    </h1>

                    <div className="flex flex-wrap gap-2 text-[11px] text-neutral-300 mb-3">
                      {t.geoorigin && (
                        <span className="px-2 py-1 rounded-full border border-zinc-700">
                          Origin: {t.geoorigin}
                        </span>
                      )}
                      {t.detail_location && (
                        <span className="px-2 py-1 rounded-full border border-zinc-700">
                          Lokasi: {t.detail_location}
                        </span>
                      )}
                      {t.years && (
                        <span className="px-2 py-1 rounded-full border border-zinc-700">
                          Years: {t.years}
                        </span>
                      )}
                    </div>

                    {t.meta_description && (
                      <p className="text-sm text-neutral-300 mb-4">
                        {t.meta_description}
                      </p>
                    )}

                    {t.image && (
                      <div className="mb-5 rounded-2xl overflow-hidden border border-zinc-800">
                        <img
                          src={t.image}
                          alt={t.philosofer ?? "ToT cover"}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    <div className="mt-2 text-[11px] text-neutral-500 space-y-1">
                      {t.geoorigin && (
                        <p>
                          <span className="font-medium">Geo origin:</span>{" "}
                          {t.geoorigin}
                        </p>
                      )}
                      {t.detail_location && (
                        <p>
                          <span className="font-medium">Detail location:</span>{" "}
                          {t.detail_location}
                        </p>
                      )}
                      {t.years && (
                        <p>
                          <span className="font-medium">Years:</span>{" "}
                          {t.years}
                        </p>
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

export default AdminToTPage;