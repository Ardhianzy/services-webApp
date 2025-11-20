// src/features/admin/pages/AdminEditShopPage.tsx

import { type FC, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  adminGetShopById,
  adminUpdateShop,
  normalizeBackendHtml,
} from "@/lib/content/api";
import { ROUTES } from "@/app/routes";

const AdminEditShopPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] =
    useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminGetShopById(id);
        if (cancelled || !data) return;

        setTitle(data.title ?? "");
        setCategory((data as any).category ?? "");
        setPrice(
          data.price === null || data.price === undefined
            ? ""
            : String(data.price)
        );
        setStock(
          (data as any).stock === null || (data as any).stock === undefined
            ? ""
            : String((data as any).stock)
        );
        setLink((data as any).link ?? "");
        setDesc(
          normalizeBackendHtml(
            ((data as any).desc as string | null | undefined) ?? ""
          )
        );
        setSlug((data as any).slug ?? "");
        setMetaTitle((data as any).meta_title ?? "");
        setMetaDescription((data as any).meta_description ?? "");
        setIsAvailable(Boolean(data.is_available));
        setIsPublished(Boolean((data as any).is_published));
        setCurrentImageUrl((data as any).image ?? "");
        setImagePreviewUrl(null);
      } catch (err: any) {
        if (cancelled) return;
        console.error(err);
        setError(err?.message ?? "Failed to load shop item");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    const formData = new FormData();
    formData.append("title", title);
    if (category) formData.append("category", category);
    if (price) formData.append("price", price);
    if (stock) formData.append("stock", stock);
    if (link) formData.append("link", link);
    if (desc) formData.append("desc", desc);
    if (slug) formData.append("slug", slug);
    if (metaTitle) formData.append("meta_title", metaTitle);
    if (metaDescription) formData.append("meta_description", metaDescription);

    formData.append("is_published", isPublished ? "true" : "false");

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setSaving(true);
      setError(null);
      await adminUpdateShop(id, formData);
      navigate(ROUTES.ADMIN.SHOP);
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to update shop item");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    } else {
      setImagePreviewUrl(null);
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-black text-white px-10 py-8 flex items-center justify-center">
        <p className="text-sm text-red-400">Invalid shop id.</p>
      </div>
    );
  }

  const previewImageSrc = imagePreviewUrl || currentImageUrl || "";
  const cleanedPrice = price.replace(/[^\d]/g, "");
  const displayPrice =
    cleanedPrice && !Number.isNaN(Number(cleanedPrice))
      ? `Rp ${new Intl.NumberFormat("id-ID").format(
          Number(cleanedPrice)
        )}`
      : "Rp -";
  const displayStock = stock.trim()
    ? `${stock.trim()} pcs`
    : "Stock belum diisi";

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-10 py-8 flex items-center justify-center">
        <p className="text-sm text-neutral-400">
          Memuat shop item untuk di-edit...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            EDIT SHOP ITEM
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Perbarui detail produk, link eksternal, metadata SEO, dan
            status publish di halaman Shop.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(ROUTES.ADMIN.SHOP)}
          className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                     hover:bg-white hover:text-black transition cursor-pointer"
        >
          KEMBALI KE LIST
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)]">
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 space-y-5">
          {error && (
            <p className="text-sm text-red-400 -mt-1">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  TITLE
                </label>
                <input
                  type="text"
                  className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                             focus:border-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
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
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="mechanical-keyboard-keychron-k6"
                />
                <p className="text-[11px] text-neutral-500">
                  Final URL: /shop/{slug || "<slug>"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-2 md:col-span-1">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  CATEGORY
                </label>
                <input
                  type="text"
                  className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                             focus:border-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-1">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  STOCK
                </label>
                <input
                  type="number"
                  className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                             focus:border-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min={0}
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-1">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  PRICE (IDR)
                </label>
                <input
                  type="number"
                  className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                             focus:border-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min={0}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                EXTERNAL LINK
              </label>
              <input
                type="url"
                className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                           focus:border-white"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                SHORT DESCRIPTION (HTML)
              </label>
              <textarea
                className="bg-black border border-zinc-700 rounded-2xl px-3 py-2 text-xs outline-none
                           min-h-[100px] focus:border-white font-mono leading-relaxed"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="<p>Deskripsi singkat produk...</p>"
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
                  value={metaTitle}
                  onChange={(e) =>
                    setMetaTitle(e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  META DESCRIPTION (SEO)
                </label>
                <textarea
                  className="bg-black border border-zinc-700 rounded-2xl px-3 py-2 text-sm outline-none
                             min-h-[80px] focus:border-white"
                  value={metaDescription}
                  onChange={(e) =>
                    setMetaDescription(e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  COVER IMAGE
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    handleImageChange(file);
                  }}
                  className="text-xs text-neutral-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-full
                             file:border file:border-zinc-600 file:bg-zinc-900 file:text-xs
                             file:hover:bg-zinc-800 cursor-pointer"
                />
                {previewImageSrc && (
                  <div className="mt-2 rounded-2xl overflow-hidden border border-zinc-800 max-h-56">
                    <img
                      src={previewImageSrc}
                      alt={title || "Preview cover"}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 text-xs text-neutral-300">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-zinc-600 bg-black"
                    checked={isAvailable}
                    onChange={(e) =>
                      setIsAvailable(e.target.checked)
                    }
                  />
                  <span>Available (stok aktif)</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-zinc-600 bg-black"
                    checked={isPublished}
                    onChange={(e) =>
                      setIsPublished(e.target.checked)
                    }
                  />
                  <span>Publish ke user</span>
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-between pt-3 border-t border-zinc-800 mt-2">
              <div className="text-[11px] text-neutral-500">
                Pastikan title dan link eksternal sudah benar
                sebelum menyimpan perubahan.
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.ADMIN.SHOP)}
                  className="px-4 py-2 rounded-full border border-zinc-600 text-xs tracking-[0.15em]
                             hover:bg-zinc-800 cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-full border border-white bg-white text-black text-xs tracking-[0.15em]
                             hover:bg-transparent hover:text-white hover:border-white disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6 overflow-hidden">
          <h2 className="text-sm font-medium tracking-[0.15em] text-neutral-400 mb-4">
            LIVE PREVIEW
          </h2>
          <div className="bg-black rounded-2xl border border-zinc-800 p-6 h-full overflow-y-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {slug && (
                <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                  /shop/{slug}
                </span>
              )}
              {category && (
                <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                  {category}
                </span>
              )}
              {cleanedPrice && (
                <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                  {displayPrice}
                </span>
              )}
              {stock.trim() && (
                <span className="text-[11px] px-2 py-1 rounded-full border border-zinc-700 text-neutral-300">
                  {stock.trim()} pcs
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
              {title || "Nama produk / bundling"}
            </h1>

            {metaDescription && (
              <p className="text-sm text-neutral-300 mb-4">
                {metaDescription}
              </p>
            )}

            {previewImageSrc && (
              <div className="mb-5 rounded-2xl overflow-hidden border border-zinc-800">
                <img
                  src={previewImageSrc}
                  alt={title || "Preview cover"}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            <div className="prose prose-invert prose-sm max-w-none mb-4">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    desc ||
                    "<p>Deskripsi singkat produk akan tampil di sini sebagaimana terlihat oleh user.</p>",
                }}
              />
            </div>

            <div className="mt-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-300">
              <div className="flex items-center gap-3">
                {previewImageSrc && (
                  <img
                    src={previewImageSrc}
                    alt={title || "Preview cover"}
                    className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {title || "Nama produk"}
                  </p>
                  <p className="text-xs text-neutral-300">
                    {displayPrice}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {displayStock}
                  </p>
                  {link && (
                    <p className="text-[11px] text-neutral-500 mt-1 truncate max-w-[220px]">
                      Link: {link}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEditShopPage;