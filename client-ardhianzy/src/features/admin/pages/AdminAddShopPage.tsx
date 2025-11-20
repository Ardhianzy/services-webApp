// src/features/admin/pages/AdminAddShopPage.tsx
import {
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { adminCreateShop } from "@/lib/content/api";

const AdminAddShopPage = () => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [link, setLink] = useState("");
  const [desc, setDesc] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] =
    useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isPublished, setIsPublished] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title wajib diisi");
      return;
    }
    if (!link.trim()) {
      setError(
        "Link wajib diisi (direct ke Tokopedia/Shopee/dll)"
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.set("title", title);
      if (slug.trim()) fd.set("slug", slug.trim());
      if (category.trim()) fd.set("category", category.trim());
      if (price.trim()) fd.set("price", price.trim());
      if (stock.trim()) fd.set("stock", stock.trim());
      if (link.trim()) fd.set("link", link.trim());
      if (desc.trim()) fd.set("desc", desc.trim());
      if (metaTitle.trim())
        fd.set("meta_title", metaTitle.trim());
      if (metaDescription.trim())
        fd.set("meta_description", metaDescription.trim());

      fd.set("is_published", isPublished ? "true" : "false");

      if (imageFile) {
        fd.set("image", imageFile);
      }

      await adminCreateShop(fd);
      navigate(ROUTES.ADMIN.SHOP);
    } catch (err: any) {
      setError(err?.message ?? "Gagal membuat shop item");
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-black text-white px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.15em]">
            NEW SHOP ITEM
          </h1>
          <p className="text-sm text-neutral-400 mt-3 max-w-xl">
            Buat item baru untuk halaman Shop, lengkap dengan harga,
            stok, link eksternal, dan metadata SEO.
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
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-3xl p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-sm text-red-400 mb-1">
                {error}
              </p>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  TITLE<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                             focus:border-white"
                  placeholder="Nama produk / bundling"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  SLUG
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                             focus:border-white font-mono"
                  placeholder="slug-url-produk"
                />
                <p className="text-[11px] text-neutral-500">
                  Final URL: /shop/{slug || "<slug>"}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  CATEGORY
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                             focus:border-white"
                  placeholder="Electronics, Book, Course, dll"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  PRICE (IDR)
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                             focus:border-white"
                  placeholder="1500000"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  STOCK
                </label>
                <input
                  type="text"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                             focus:border-white"
                  placeholder="50"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  EXTERNAL LINK<span className="text-red-500">
                    *
                  </span>
                </label>
                <input
                  type="url"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                             focus:border-white"
                  placeholder="https://www.tokopedia.com/..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-neutral-400 tracking-[0.15em]">
                SHORT DESCRIPTION (HTML)
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="bg-black border border-zinc-700 rounded-2xl px-3 py-2 text-sm outline-none
                           min-h-[80px] resize-vertical focus:border-white font-mono leading-relaxed"
                placeholder="<p>Deskripsi singkat produk/bundling...</p>"
              />
              <p className="text-[11px] text-neutral-500">
                *Masukkan HTML utuh (&lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, dll).
                Di sisi user, HTML ini akan dirender sama persis (setelah
                normalisasi).
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  META TITLE (SEO)
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) =>
                    setMetaTitle(e.target.value)
                  }
                  className="bg-black border border-zinc-700 rounded-xl px-3 py-2 text-sm outline-none
                             focus:border-white"
                  placeholder="Title SEO untuk halaman produk"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  META DESCRIPTION (SEO)
                </label>
                <textarea
                  value={metaDescription}
                  onChange={(e) =>
                    setMetaDescription(e.target.value)
                  }
                  className="bg-black border border-zinc-700 rounded-2xl px-3 py-2 text-sm outline-none
                             min-h-[60px] resize-vertical focus:border-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-neutral-400 tracking-[0.15em]">
                  IMAGE
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-xs text-neutral-300 file:mr-3 file:px-3 file:py-1.5 file:rounded-full
                             file:border file:border-zinc-600 file:bg-zinc-900 file:text-xs
                             file:hover:bg-zinc-800 cursor-pointer"
                />
                <p className="text-[11px] text-neutral-500">
                  Upload cover produk (jpg/png). Backend akan
                  menyimpan URL seperti:
                  <br />
                  <code className="text-[11px]">
                    https://ik.imagekit.io/qzqpwof8s/Ardianzy/shop/...
                  </code>
                </p>
                {imagePreviewUrl && (
                  <div className="mt-2 rounded-2xl overflow-hidden border border-zinc-800 max-h-56">
                    <img
                      src={imagePreviewUrl}
                      alt="Preview cover"
                      className="w-full h-56 object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 text-xs text-neutral-300">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) =>
                      setIsAvailable(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-zinc-600 bg-black"
                  />
                </label>
                <span>Available (stok aktif)</span>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) =>
                      setIsPublished(e.target.checked)
                    }
                    className="w-4 h-4 rounded border-zinc-600 bg-black"
                  />
                  <span>Publish ke user begitu disimpan</span>
                </label>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-between pt-3 border-t border-zinc-800 mt-2">
              <div className="text-[11px] text-neutral-500">
                Pastikan title dan link eksternal sudah benar
                sebelum menyimpan item Shop.
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
                  disabled={submitting}
                  className="px-4 py-2 rounded-full border border-white bg-white text-black text-xs tracking-[0.15em]
                             hover:bg-transparent hover:text-white hover:border-white disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "SAVING..." : "SAVE ITEM"}
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

            {imagePreviewUrl && (
              <div className="mb-5 rounded-2xl overflow-hidden border border-zinc-800">
                <img
                  src={imagePreviewUrl}
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
                    "<p>Deskripsi produk akan tampil di sini sebagaimana terlihat oleh user.</p>",
                }}
              />
            </div>

            <div className="mt-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-neutral-300">
              <div className="flex items-center gap-3">
                {imagePreviewUrl && (
                  <img
                    src={imagePreviewUrl}
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

export default AdminAddShopPage;