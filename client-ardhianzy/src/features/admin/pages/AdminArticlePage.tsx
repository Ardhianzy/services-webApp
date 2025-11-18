// src/features/admin/pages/AdminArticlePage.tsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import {
  adminFetchArticles,
  adminDeleteArticle,
} from "@/lib/content/api";
import type { ArticleDTO } from "@/lib/content/types";

type FilterCategory = "ALL" | "READING_GUIDLINE" | "IDEAS_AND_TRADITIONS" | "POP_CULTURE";

const CATEGORY_LABEL: Record<FilterCategory, string> = {
  ALL: "Semua Kategori",
  READING_GUIDLINE: "Reading Guide",
  IDEAS_AND_TRADITIONS: "Ideas & Tradition",
  POP_CULTURE: "Popsophia / Pop Culture",
};

// Helper kecil untuk format tanggal di list
function formatDateShort(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const AdminArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticleDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("ALL");
  const [search, setSearch] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<ArticleDTO | null>(null);

  // NEW: load data artikel admin
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminFetchArticles();
        if (!cancelled) {
          setArticles(data);
          setSelectedArticle(data[0] ?? null);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Gagal memuat daftar artikel.");
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

  // NEW: filter berdasarkan kategori + search
  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return articles.filter((raw: any) => {
      const title: string = raw.title ?? "";
      const category: string | undefined = raw.category;
      const matchSearch = !q || title.toLowerCase().includes(q);
      const matchCategory =
        filterCategory === "ALL" || category === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [articles, filterCategory, search]);

  // NEW: delete artikel
  const handleDelete = async (id: string) => {
    const sure = window.confirm(
      "Yakin ingin menghapus artikel ini? Tindakan ini tidak bisa dibatalkan."
    );
    if (!sure) return;

    try {
      await adminDeleteArticle(id);
      setArticles((prev) => prev.filter((a: any) => a.id !== id));
      setSelectedArticle((prev: any) =>
        prev && prev.id === id ? null : prev
      );
    } catch (e: any) {
      alert(e?.message || "Gagal menghapus artikel.");
    }
  };

  // NEW: jika artikel yang sedang terpilih hilang dari filtered list, reset
  useEffect(() => {
    if (!selectedArticle) return;
    const stillExists = filteredArticles.some(
      (a: any) => a.id === (selectedArticle as any).id
    );
    if (!stillExists) {
      setSelectedArticle(filteredArticles[0] ?? null);
    }
  }, [filteredArticles, selectedArticle]);

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            ADMIN ARTICLES
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Kelola artikel untuk Reading Guide, Ideas &amp; Tradition,
            dan Popsophia. Data di sini terhubung langsung dengan API
            <span className="ml-1 text-neutral-500">
              (/api/articel)
            </span>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.ARTICLES_ADD)}
          className="px-5 py-2 rounded-full border border-white text-sm tracking-[0.15em]
                     hover:bg-white hover:text-black transition cursor-pointer"
        >
          + ARTICLE BARU
        </button>
      </div>

      {/* Layout: kiri = list, kanan = preview */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)]">
        {/* KIRI: LIST */}
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6">
          {/* Filter bar */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-5">
            <div className="flex gap-3">
              <select
                className="bg-black border border-zinc-700 rounded-full px-4 py-2 text-sm outline-none
                           focus:border-white cursor-pointer"
                value={filterCategory}
                onChange={(e) =>
                  setFilterCategory(e.target.value as FilterCategory)
                }
              >
                {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Cari judul artikel..."
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
            <p className="text-sm text-neutral-400">Memuat artikel...</p>
          ) : error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : filteredArticles.length === 0 ? (
            <p className="text-sm text-neutral-400">
              Belum ada artikel yang sesuai filter.
            </p>
          ) : (
            <div className="border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/80 text-neutral-400">
                  <tr>
                    <th className="text-center px-4 py-3 font-normal w-[24%]">
                      Judul
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[18%]">
                      Kategori
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[18%]">
                      Tanggal
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[12%]">
                      Status
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[14%]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArticles.map((raw: any, idx) => {
                    const isPublished = Boolean(raw.is_published);
                    const isSelected =
                      selectedArticle &&
                      (selectedArticle as any).id === raw.id;
                    return (
                      <tr
                        key={raw.id ?? idx}
                        className={`border-t border-zinc-800/70 ${
                          isSelected ? "bg-white/5" : "bg-transparent"
                        } hover:bg-white/5 transition`}
                        onClick={() => setSelectedArticle(raw)}
                      >
                        <td className="px-4 py-3 align-top">
                          <div className="font-medium text-sm">
                            {raw.title ?? "-"}
                          </div>
                          <div className="text-xs text-neutral-500 truncate max-w-[190px]">
                            {raw.excerpt ?? raw.meta_description ?? ""}
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] border border-zinc-700">
                            {raw.category ?? "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top text-neutral-400">
                          {formatDateShort(raw.date)}
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-[11px] ${
                              isPublished
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                                : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40"
                            }`}
                          >
                            {isPublished ? "Published" : "Draft / Preview"}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(
                                  ROUTES.ADMIN.ARTICLES_EDIT(
                                    String(raw.id)
                                  )
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
                                handleDelete(String(raw.id));
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
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 overflow-hidden flex flex-col">
          <h2 className="text-sm font-medium tracking-[0.15em] text-neutral-400 mb-4">
            LIVE PREVIEW (ADMIN)
          </h2>

          {!selectedArticle ? (
            <p className="text-sm text-neutral-500">
              Pilih salah satu artikel di sebelah kiri untuk melihat preview HTML-nya.
            </p>
          ) : (
            <div className="bg-black rounded-2xl border border-zinc-800/80 p-6 overflow-y-auto">
              {(() => {
                const a: any = selectedArticle;
                const isPublished = Boolean(a.is_published);

                return (
                  <>
                    {/* Meta / heading */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                        {a.category ?? "UNCATEGORIZED"}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {formatDateShort(a.date)}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        • {a.author ?? "Author tidak di-set"}
                      </span>
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

                    <h1 className="text-2xl md:text-3xl font-semibold mb-4">
                      {a.title ?? "Tanpa judul"}
                    </h1>

                    {a.excerpt && (
                      <p className="text-sm text-neutral-300 mb-4">
                        {a.excerpt}
                      </p>
                    )}

                    {/* Cover image (kalau URL sudah resolvable dari backend) */}
                    {a.image && typeof a.image === "string" && (
                      <div className="mb-6 rounded-2xl overflow-hidden border border-zinc-800">
                        <img
                          src={a.image}
                          alt={a.title ?? ""}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    {/* Konten HTML utuh */}
                    <div
                      className="prose prose-invert prose-sm max-w-none"
                      // NEW: backend kirim string HTML; di admin kita render sama seperti di user
                      dangerouslySetInnerHTML={{
                        __html: a.content ?? a.meta_description ?? "",
                      }}
                    />
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

export default AdminArticlePage;