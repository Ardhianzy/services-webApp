// src/features/admin/pages/AdminResearchPage.tsx

import { type FC, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import {
  adminFetchResearch,
  adminDeleteResearch,
  normalizeBackendHtml,
} from "@/lib/content/api";
import type { ResearchDTO } from "@/lib/content/types";

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

const AdminResearchPage: FC = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState<ResearchDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [selected, setSelected] = useState<ResearchDTO | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminFetchResearch({ page: 1, limit: 1000 });
        if (cancelled) return;
        setRows(data);
        setSelected(data[0] ?? null);
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Gagal memuat daftar research.");
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
    return rows.filter((r) => {
      const title = (r.research_title ?? "").toLowerCase();
      const slug = (r.slug ?? "").toLowerCase();

      const matchSearch =
        !q ||
        title.includes(q) ||
        slug.includes(q);

      const isPublished = Boolean(r.is_published);
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
    const stillExists = filteredRows.some((r) => r.id === selected.id);
    if (!stillExists) {
      setSelected(filteredRows[0] ?? null);
    }
  }, [filteredRows, selected]);

  const handleDelete = async (id: string) => {
    const ok = window.confirm(
      "Yakin ingin menghapus research ini? Tindakan ini tidak bisa dibatalkan."
    );
    if (!ok) return;

    try {
      await adminDeleteResearch(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
      setSelected((prev) => (prev && prev.id === id ? null : prev));
    } catch (e: any) {
      alert(e?.message || "Gagal menghapus research.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-7 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            ADMIN RESEARCH
          </h1>
          <p className="text-sm text-neutral-400 mt-3 max-w-xl">
            Kelola entri Ardhianzy Research yang tampil di halaman Research.
            Setiap entri terhubung dengan ringkasan HTML dan satu file PDF utama.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.RESEARCH_ADD)}
          className="px-5 py-2 rounded-full border border-white text-sm font-medium tracking-[0.15em]
                     hover:bg-white hover:text-black transition cursor-pointer"
        >
          + RESEARCH BARU
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
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              >
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
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
            <p className="text-sm text-neutral-400">Memuat research...</p>
          ) : error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : filteredRows.length === 0 ? (
            <p className="text-sm text-neutral-400">
              Belum ada research yang sesuai filter.
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
                  {filteredRows.map((r) => {
                    const isPublished = Boolean(r.is_published);
                    const isSelected = selected?.id === r.id;
                    return (
                      <tr
                        key={r.id}
                        className={`border-t border-zinc-800/70 ${
                          isSelected ? "bg-white/5" : "bg-transparent"
                        } hover:bg-white/5 transition cursor-pointer`}
                        onClick={() => setSelected(r)}
                      >
                        <td className="px-4 py-3 align-top">
                          <div className="font-medium text-sm">
                            {r.research_title ?? "-"}
                          </div>
                          <div className="text-xs text-neutral-500 truncate max-w-[250px]">
                            {r.meta_description ?? ""}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top text-xs text-neutral-400 text-center">
                          {r.pdf_filename
                            ? r.pdf_filename
                            : r.pdf_url
                            ? "PDF tersedia"
                            : "Belum ada PDF"}
                        </td>
                        <td className="px-4 py-3 align-top text-neutral-400 text-xs text-center">
                          {formatDateShort(r.updated_at ?? r.created_at)}
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
                                navigate(ROUTES.ADMIN.RESEARCH_EDIT(r.id));
                              }}
                              className="text-xs px-3 py-1 rounded-full border border-zinc-700 hover:bg-white hover:text-black transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(r.id);
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
              Pilih salah satu research di sebelah kiri untuk melihat ringkasan
              HTML dan detail PDF-nya.
            </p>
          ) : (
            <div className="bg-black rounded-2xl border border-zinc-800/80 py-5 px-4 overflow-y-auto">
              <style>{`
                .card-typography{
                  font-family: Roboto, ui-sans-serif, system-ui;
                  font-size: 1.02rem;
                  line-height: 1.85;
                  color: #fff;
                  text-align: justify;
                  text-justify: inter-word;
                  hyphens: auto;
                  word-break: break-word;
                }
                .card-typography h1,.card-typography h2,.card-typography h3,.card-typography h4{
                  font-family: Roboto, ui-sans-serif, system-ui;
                  font-weight: 700;
                  line-height: 1.25;
                  margin: .85em 0 .45em;
                  letter-spacing: .2px;
                }
                .card-typography h1{font-size:1.15rem}
                .card-typography h2{font-size:1.08rem}
                .card-typography h3{font-size:1.04rem}
                .card-typography h4{font-size:1.02rem}
                .card-typography p{margin:0 0 1em}
                .card-typography blockquote{margin:1em 0;padding:.75em 1em;border-left:3px solid rgba(255,255,255,.35);background:rgba(255,255,255,.04);border-radius:8px}
                .card-typography blockquote p{margin:.4em 0}
                .card-typography blockquote footer{margin-top:.55em;opacity:.85;font-size:.92em}
                .card-typography ul,.card-typography ol{margin:.6em 0 1.1em;padding-left:1.3em}
                .card-typography ul{list-style:disc}
                .card-typography ol{list-style:decimal}
                .card-typography img,.card-typography video,.card-typography iframe{max-width:100%;height:auto}
                .card-typography a{color:#fff;text-decoration:underline;text-underline-offset:2px;text-decoration-color:rgba(255,255,255,.6)}

                .card-typography table{
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1.1em 0;
                  font-size: 0.98rem;
                  text-align: left;
                }
                .card-typography thead th{
                  background: rgba(255,255,255,.06);
                  font-weight: 700;
                }
                .card-typography th,
                .card-typography td{
                  border: 1px solid rgba(255,255,255,.28);
                  padding: .55em .8em;
                  vertical-align: top;
                  text-align: left;
                  text-justify: auto;
                  hyphens: auto;
                  word-break: break-word;
                }
                .card-typography tbody tr:nth-child(even){
                  background: rgba(255,255,255,.02);
                }

                @media (max-width: 768px){
                  .card-typography{
                    font-size:1rem;
                    line-height:1.8;
                  }
                  .card-typography table{
                    display: block;
                    width: 100%;
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                  }
                }
              `}</style>

              {(() => {
                const r = selected;
                const isPublished = Boolean(r.is_published);
                const htmlSummary = normalizeBackendHtml(r.research_sum ?? "");

                return (
                  <>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                        {r.slug || "tanpa-slug"}
                      </span>
                      {r.research_date && (
                        <span className="text-[11px] text-neutral-500">
                          Dibuat {formatDateShort(r.research_date)}
                        </span>
                      )}
                      {r.updated_at && (
                        <span className="text-[11px] text-neutral-500">
                          • Update {formatDateShort(r.updated_at)}
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
                      {r.research_title ?? "Tanpa judul"}
                    </h1>

                    <div className="flex flex-wrap gap-2 text-[11px] text-neutral-300 mb-3">
                      {r.researcher && (
                        <span className="px-2 py-1 rounded-full border border-zinc-700">
                          Peneliti: {r.researcher}
                        </span>
                      )}
                      {r.fiel && (
                        <span className="px-2 py-1 rounded-full border border-zinc-700">
                          Field: {r.fiel}
                        </span>
                      )}
                    </div>

                    {r.meta_description && (
                      <p className="text-sm text-neutral-300 mb-4">
                        {r.meta_description}
                      </p>
                    )}

                    {r.image && (
                      <div className="mb-5 rounded-2xl overflow-hidden border border-zinc-800">
                        <img
                          src={r.image}
                          alt={r.research_title ?? "Cover research"}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    {htmlSummary && (
                      <div
                        className="card-typography prose prose-invert prose-sm max-w-none mb-6"
                        dangerouslySetInnerHTML={{
                          __html: htmlSummary || "—",
                        }}
                      />
                    )}

                    <div className="mt-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium">
                          PDF Research Utama
                        </p>
                        <p className="text-xs text-neutral-400 truncate max-w-xs">
                          {r.pdf_filename
                            ? r.pdf_filename
                            : r.pdf_url
                            ? r.pdf_url
                            : "Belum ada file PDF terunggah."}
                        </p>
                        {typeof r.pdf_size === "number" && (
                          <p className="text-[11px] text-neutral-500 mt-1">
                            ~{(r.pdf_size / 1024).toFixed(1)} KB
                          </p>
                        )}
                      </div>
                      {r.pdf_url && (
                        <a
                          href={r.pdf_url}
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

export default AdminResearchPage;