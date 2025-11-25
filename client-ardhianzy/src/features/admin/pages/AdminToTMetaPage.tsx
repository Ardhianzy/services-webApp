// src/features/admin/pages/AdminToTMetaPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import {
  adminFetchToTMeta,
  adminDeleteToTMeta,
  normalizeBackendHtml,
  type ToTMetaDTO,
} from "@/lib/content/api";

const AdminToTMetaPage: React.FC = () => {
  const [items, setItems] = useState<ToTMetaDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<ToTMetaDTO | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminFetchToTMeta({ page: 1, limit: 1000 });
      setItems(data);
      setSelected((prev) => prev ?? data[0] ?? null);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load ToT Meta");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      setSelected(null);
      return;
    }
    if (!selected) {
      setSelected(items[0]);
      return;
    }
    const stillExists = items.some((x) => x.id === selected.id);
    if (!stillExists) {
      setSelected(items[0] ?? null);
    }
  }, [items, selected]);

  const handleDelete = async (id: string) => {
    const target = items.find((x) => x.id === id);
    const label =
      target?.tot?.philosofer ?? target?.ToT_id ?? "this ToT Meta entry";

    const ok = window.confirm(
      `Yakin ingin menghapus ToT Meta untuk "${label}"? Tindakan ini tidak bisa dibatalkan.`
    );
    if (!ok) return;

    try {
      setDeletingId(id);
      await adminDeleteToTMeta(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete ToT Meta");
    } finally {
      setDeletingId(null);
    }
  };

  //   const snippet = (html?: string | null) => {
  //     if (!html) return "—";
  //     const normalized = normalizeBackendHtml(html);
  //     const plain = normalized.replace(/<[^>]+>/g, "").trim();
  //     if (!plain) return "—";
  //     if (plain.length <= 120) return plain;
  //     return plain.slice(0, 120) + "…";
  //   };

  const renderHtml = (html?: string | null) => ({
    __html: normalizeBackendHtml(html || ""),
  });

  return (
    <div className="min-h-screen bg-black text-white px-7 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            ADMIN TIMELINE OF THOUGHT META
          </h1>
          <p className="text-sm text-neutral-400 mt-3 max-w-xl">
            Kelola penjelasan Metafisika, Epistemologi, Aksiologi, dan
            Kesimpulan untuk setiap entri Timeline of Thought (ToT).
          </p>
        </div>

        <Link
          to={ROUTES.ADMIN.TOT_META_ADD}
          className="inline-flex items-center rounded-full bg-transparent border-1 border-white text-white px-4 py-2 text-sm font-medium hover:bg-white hover:text-black transition-colors"
        >
          + ToT META BARU
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1.3fr)]">
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl py-4 px-3">
          {loading ? (
            <p className="text-sm text-gray-400">Loading ToT Meta…</p>
          ) : error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-400">
              Belum ada ToT Meta yang tersimpan. Silakan buat baru.
            </p>
          ) : (
            <div className="border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="min-w-full text-sm border-collapse">
                <thead className="bg-zinc-900/80 text-xs uppercase tracking-wide text-gray-400">
                  <tr className="border-b border-[#333333]">
                    <th className="py-2 px-6 text-center font-normal w-[40%]">
                      Filsuf
                    </th>
                    <th className="py-2 px-6 text-center font-normal w-[30%]">
                      Status
                    </th>
                    <th className="py-2 px-6 text-center font-normal w-[30%]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const isDraft = !item.is_published;
                    const label =
                      item.tot?.philosofer ??
                      item.tot?.id ??
                      item.ToT_id ??
                      "—";
                    const isSelected = selected?.id === item.id;

                    return (
                      <tr
                        key={item.id}
                        className={`border-t border-zinc-800/70 ${
                          isSelected ? "bg-white/5" : "bg-transparent"
                        } hover:bg-white/5 transition cursor-pointer`}
                        onClick={() => setSelected(item)}
                      >
                        <td className="py-3 px-6 align-top">
                          <div className="font-medium text-white text-sm">
                            {label}
                          </div>
                          {item.tot?.years && (
                            <div className="text-[11px] text-gray-400">
                              {item.tot.years}
                            </div>
                          )}
                          {item.tot?.geoorigin && (
                            <div className="text-[11px] text-gray-500">
                              {item.tot.geoorigin}
                            </div>
                          )}
                        </td>
                        <td className="text-center py-3 px-4 align-top">
                          <span
                            className={[
                              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                              isDraft
                                ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/40"
                                : "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
                            ].join(" ")}
                          >
                            {isDraft ? "Draft" : "Published"}
                          </span>
                        </td>
                        <td className="py-3 pl-4 align-top text-center">
                          <div className="inline-flex items-center gap-2">
                            <Link
                              to={ROUTES.ADMIN.TOT_META_EDIT(item.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-500/60 hover:bg-gray-100 hover:text-black transition-colors"
                            >
                              Edit
                            </Link>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                void handleDelete(item.id);
                              }}
                              disabled={deletingId === item.id}
                              className="text-xs font-medium px-3 py-1.5 rounded-full border border-red-500/60 text-red-300 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-60"
                            >
                              {deletingId === item.id ? "Deleting…" : "Delete"}
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
            LIVE PREVIEW ToT META
          </h2>

          {!selected ? (
            <p className="text-sm text-neutral-500">
              Pilih salah satu ToT Meta di sebelah kiri untuk melihat preview
              struktur Metafisika, Epistemologi, Aksiologi, dan Kesimpulan.
            </p>
          ) : (
            <div className="bg-black rounded-2xl border border-zinc-800/80 py-5 px-4 overflow-y-auto max-h-[70vh] space-y-5">
              {(() => {
                const m = selected;
                const tot = m.tot;
                const isDraft = !m.is_published;

                return (
                  <>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.18em] text-neutral-400">
                          ToT META PREVIEW
                        </p>
                        <h1 className="text-xl md:text-2xl font-semibold truncate">
                          {tot?.philosofer ?? "Tanpa nama filsuf"}
                        </h1>
                        <div className="flex flex-wrap gap-2 mt-1 text-[11px] text-neutral-400">
                          {tot?.years && <span>{tot.years}</span>}
                          {tot?.geoorigin && (
                            <span className="before:content-['•'] before:mx-1">
                              {tot.geoorigin}
                            </span>
                          )}
                          <span className="before:content-['•'] before:mx-1">
                            ToT ID: {m.ToT_id}
                          </span>
                        </div>
                      </div>

                      <span
                        className={[
                          "ml-auto inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border",
                          isDraft
                            ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/40"
                            : "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
                        ].join(" ")}
                      >
                        {isDraft ? "Draft" : "Published"}
                      </span>
                    </div>

                    {m.metafisika && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.18em]">
                          Metafisika
                        </p>
                        <div
                          className="admin-totmeta-html"
                          dangerouslySetInnerHTML={renderHtml(m.metafisika)}
                        />
                      </div>
                    )}

                    {m.epsimologi && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.18em]">
                          Epistemologi
                        </p>
                        <div
                          className="admin-totmeta-html"
                          dangerouslySetInnerHTML={renderHtml(m.epsimologi)}
                        />
                      </div>
                    )}

                    {m.aksiologi && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.18em]">
                          Aksiologi
                        </p>
                        <div
                          className="admin-totmeta-html"
                          dangerouslySetInnerHTML={renderHtml(m.aksiologi)}
                        />
                      </div>
                    )}

                    {m.conclusion && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.18em]">
                          Conclusion
                        </p>
                        <div
                          className="admin-totmeta-html"
                          dangerouslySetInnerHTML={renderHtml(m.conclusion)}
                        />
                      </div>
                    )}

                    {!m.metafisika &&
                      !m.epsimologi &&
                      !m.aksiologi &&
                      !m.conclusion && (
                        <p className="text-xs text-neutral-500">
                          Belum ada konten Metafisika / Epistemologi / Aksiologi /
                          Conclusion yang diisi untuk ToT Meta ini. Edit entri
                          untuk menambahkan konten HTML.
                        </p>
                      )}

                    <div className="pt-2 border-t border-zinc-800 mt-3 text-[11px] text-neutral-500 space-y-1">
                      {m.created_at && (
                        <p>
                          <span className="font-medium">Created at:</span>{" "}
                          {m.created_at}
                        </p>
                      )}
                      {m.updated_at && (
                        <p>
                          <span className="font-medium">Updated at:</span>{" "}
                          {m.updated_at}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Meta ID:</span> {m.id}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-totmeta-html{
          font-family: Roboto, ui-sans-serif, system-ui;
          font-size: 1.02rem;
          line-height: 1.85;
          color: #fff;
          text-align: justify;
          text-justify: inter-word;
          hyphens: auto;
          word-break: break-word;
        }
        .admin-totmeta-html h1,
        .admin-totmeta-html h2,
        .admin-totmeta-html h3,
        .admin-totmeta-html h4{
          font-family: Roboto, ui-sans-serif, system-ui;
          font-weight: 700;
          line-height: 1.25;
          margin: .85em 0 .45em;
          letter-spacing: .2px;
        }
        .admin-totmeta-html h1{font-size:1.15rem}
        .admin-totmeta-html h2{font-size:1.08rem}
        .admin-totmeta-html h3{font-size:1.04rem}
        .admin-totmeta-html h4{font-size:1.02rem}
        .admin-totmeta-html p{margin:0 0 1em}
        .admin-totmeta-html blockquote{
          margin:1em 0;
          padding:.75em 1em;
          border-left:3px solid rgba(255,255,255,.35);
          background:rgba(255,255,255,.04);
          border-radius:8px;
        }
        .admin-totmeta-html blockquote p{margin:.4em 0}
        .admin-totmeta-html blockquote footer{
          margin-top:.55em;
          opacity:.85;
          font-size:.92em;
        }
        .admin-totmeta-html ul,
        .admin-totmeta-html ol{
          margin:.6em 0 1.1em;
          padding-left:1.3em;
        }
        .admin-totmeta-html ul{list-style:disc}
        .admin-totmeta-html ol{list-style:decimal}
        .admin-totmeta-html img,
        .admin-totmeta-html video,
        .admin-totmeta-html iframe{
          max-width:100%;
          height:auto;
        }
        .admin-totmeta-html a{
          color:#fff;
          text-decoration:underline;
          text-underline-offset:2px;
          text-decoration-color:rgba(255,255,255,.6);
        }

        .admin-totmeta-html table{
          width: 100%;
          border-collapse: collapse;
          margin: 1.1em 0;
          font-size: 0.98rem;
          text-align: left;
        }
        .admin-totmeta-html thead th{
          background: rgba(255,255,255,.06);
          font-weight: 700;
        }
        .admin-totmeta-html th,
        .admin-totmeta-html td{
          border: 1px solid rgba(255,255,255,.28);
          padding: .55em .8em;
          vertical-align: top;
          text-align: left;
          text-justify: auto;
          hyphens: auto;
          word-break: break-word;
        }
        .admin-totmeta-html tbody tr:nth-child(even){
          background: rgba(255,255,255,.02);
        }

        @media (max-width: 768px){
          .admin-totmeta-html{
            font-size:1rem;
            line-height:1.8;
          }
          .admin-totmeta-html table{
            display: block;
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminToTMetaPage;