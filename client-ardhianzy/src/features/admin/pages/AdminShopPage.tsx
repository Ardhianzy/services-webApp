// src/features/admin/pages/AdminShopPage.tsx

import {
  type FC,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  adminFetchShops,
  adminDeleteShop,
  normalizeBackendHtml,
} from "@/lib/content/api";
import type { ShopDTO } from "@/lib/content/types";
import { ROUTES } from "@/app/routes";

type StatusFilter = "ALL" | "PUBLISHED" | "DRAFT";

const STATUS_LABEL: Record<StatusFilter, string> = {
  ALL: "Semua Status",
  PUBLISHED: "Published",
  DRAFT: "Draft / Preview",
};

function parseFlag(value: unknown): boolean {
  if (value === true) return true;
  if (value === false) return false;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "1" || v === "true" || v === "yes";
  }
  return false;
}

const AdminShopPage: FC = () => {
  const [shops, setShops] = useState<ShopDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("ALL");
  const [selected, setSelected] = useState<ShopDTO | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminFetchShops({ page: 1, limit: 1000 });
        if (cancelled) return;
        const safe = Array.isArray(data) ? data : [];
        setShops(safe);
        setSelected(safe[0] ?? null);
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message ?? "Failed to load shops");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredShops = useMemo(() => {
    const q = search.trim().toLowerCase();
    return shops.filter((item) => {
      const title = (item.title ?? "").toLowerCase();
      const slug = (item.slug ?? "").toLowerCase();
      const matchSearch =
        !q || title.includes(q) || slug.includes(q);

      const isPublished = parseFlag(item.is_published);
      const matchStatus =
        statusFilter === "ALL"
          ? true
          : statusFilter === "PUBLISHED"
          ? isPublished
          : !isPublished;

      return matchSearch && matchStatus;
    });
  }, [shops, search, statusFilter]);

  useEffect(() => {
    if (!selected) return;
    const stillExists = filteredShops.some(
      (s) => s.id === selected.id
    );
    if (!stillExists) {
      setSelected(filteredShops[0] ?? null);
    }
  }, [filteredShops, selected]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this shop item?")) return;
    try {
      setDeletingId(id);
      await adminDeleteShop(id);
      setShops((prev) => prev.filter((s) => s.id !== id));
      setSelected((prev) => (prev && prev.id === id ? null : prev));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    } finally {
      setDeletingId(null);
    }
  };

  const toCell = (value: string | number | null | undefined): string =>
    value === null || value === undefined || value === ""
      ? "-"
      : String(value);

  return (
    <div className="min-h-screen bg-black text-white px-7 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            ADMIN SHOP
          </h1>
          <p className="text-sm text-neutral-400 mt-3 max-w-xl">
            Kelola item yang tampil di halaman Shop, termasuk gambar,
            harga, stok, dan status publish/availability.
          </p>
        </div>
        <Link
          to={ROUTES.ADMIN.SHOP_ADD}
          className="px-5 py-2 rounded-full border border-white text-sm font-medium tracking-[0.15em]
                     hover:bg-white hover:text-black transition cursor-pointer"
        >
          + SHOP ITEM BARU
        </Link>
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
              Memuat shop items...
            </p>
          ) : error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : filteredShops.length === 0 ? (
            <p className="text-sm text-neutral-400">
              Belum ada item shop yang sesuai filter.
            </p>
          ) : (
            <div className="border border-zinc-800 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/80 text-neutral-400">
                  <tr>
                    <th className="text-center px-4 py-3 font-normal w-[32%]">
                      Judul
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[14%]">
                      Kategori
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[12%]">
                      Harga
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[10%]">
                      Stok
                    </th>
                    <th className="text-center px-4 py-3 font-normal w-[12%]">
                      Available
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
                  {filteredShops.map((item) => {
                    const isPublished = parseFlag(item.is_published);
                    const isAvailable = parseFlag(item.is_available);
                    const isSelected = selected?.id === item.id;

                    return (
                      <tr
                        key={item.id}
                        className={`border-t border-zinc-800/70 ${
                          isSelected ? "bg-white/5" : "bg-transparent"
                        } hover:bg-white/5 transition cursor-pointer`}
                        onClick={() => setSelected(item)}
                      >
                        <td className="px-4 py-3 align-top max-w-[260px]">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.title ?? ""}
                                className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {item.title}
                              </span>
                              {item.slug && (
                                <span className="text-[11px] text-neutral-500 font-mono">
                                  /shop/{item.slug}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="text-center px-4 py-3 text-xs text-neutral-300 align-top">
                          {toCell(item.category ?? null)}
                        </td>
                        <td className="text-center px-4 py-3 text-xs text-neutral-300 align-top">
                          {toCell(item.price ?? null)}
                        </td>
                        <td className="text-center px-4 py-3 text-xs text-neutral-300 align-top">
                          {toCell(item.stock ?? null)}
                        </td>
                        <td className="text-center px-4 py-3 text-xs align-top">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] ${
                              isAvailable
                                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                                : "bg-red-500/10 text-red-300 border border-red-500/40"
                            }`}
                          >
                            {isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="text-center px-4 py-3 text-xs align-top">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] ${
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
                                  ROUTES.ADMIN.SHOP_EDIT(item.id)
                                );
                              }}
                              className="text-xs px-3 py-1 rounded-full border border-zinc-700 hover:bg-white hover:text-black transition cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === item.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              className="text-xs px-3 py-1 rounded-full border border-red-500/60 text-red-300 hover:bg-red-500 hover:text-white disabled:opacity-60 transition cursor-pointer"
                            >
                              {deletingId === item.id
                                ? "Deleting..."
                                : "Hapus"}
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
              Pilih salah satu item Shop di sebelah kiri untuk melihat
              preview kartu produk di halaman Shop.
            </p>
          ) : (
            <div className="bg-black rounded-2xl border border-zinc-800/80 py-5 px-4 overflow-y-auto">
              {(() => {
                const item = selected;
                const isPublished = parseFlag(item.is_published);
                const isAvailable = parseFlag(item.is_available);
                const rawDesc = item.desc ?? "";
                const htmlDesc =
                  typeof rawDesc === "string" && rawDesc.trim()
                    ? normalizeBackendHtml(rawDesc)
                    : "";

                return (
                  <>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {item.slug && (
                        <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                          /shop/{item.slug}
                        </span>
                      )}
                      {item.category && (
                        <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                          {item.category}
                        </span>
                      )}
                      {typeof item.price === "number" && (
                        <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                          Harga: {item.price}
                        </span>
                      )}
                      {typeof item.stock === "number" && (
                        <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                          Stok: {item.stock}
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
                      {item.title ?? "Tanpa judul"}
                    </h1>

                    {item.image && (
                      <div className="mb-5 rounded-2xl overflow-hidden border border-zinc-800">
                        <img
                          src={item.image}
                          alt={item.title ?? ""}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    {htmlDesc && (
                      <div className="prose prose-invert prose-sm max-w-none mb-5">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: htmlDesc,
                          }}
                        />
                      </div>
                    )}

                    <div className="mt-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.title ?? ""}
                            className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {item.title ?? "Nama produk"}
                          </p>
                          {typeof item.price === "number" && (
                            <p className="text-xs text-neutral-300">
                              Harga: {item.price}
                            </p>
                          )}
                          {item.category && (
                            <p className="text-[11px] text-neutral-500 mt-0.5">
                              Kategori: {item.category}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 text-xs">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] ${
                            isAvailable
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                              : "bg-red-500/10 text-red-300 border border-red-500/40"
                          }`}
                        >
                          {isAvailable ? "Available" : "Unavailable"}
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          Preview kartu di halaman Shop
                        </span>
                      </div>
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

export default AdminShopPage;