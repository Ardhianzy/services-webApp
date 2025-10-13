// src/features/shop/components/ShopListingSection.tsx
import { useEffect, useState } from "react";
import ProductDetailPopup from "@/features/shop/components/ProductDetailPopup";
import type { Product } from "@/types/shop";
import type { ShopItem } from "@/features/shop/types";
import { listShop } from "@/features/shop/api";

type FilterState = {
  product: string;
  theme: string;
};

type SidebarProps = {
  products: Product[];
  selected: FilterState;
  onChange: (next: FilterState) => void;
};

function FilterSidebar({ products, selected, onChange }: SidebarProps) {
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const themes = ["All", ...Array.from(new Set(products.map((p) => p.theme)))];

  const renderRadio = (name: keyof FilterState, value: string) => (
    <label
      key={`${name}-${value}`}
      className="flex cursor-pointer items-center gap-3 text-[#B1B1B1]"
      style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14 }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected[name] === value}
        onChange={() => onChange({ ...selected, [name]: value })}
        className="peer sr-only"
      />
      <span className="inline-block h-[14px] w-[14px] rounded-full border-2 border-[#E1E1E1] bg-[#444] transition-colors peer-checked:bg-[#E1E1E1]" />
      {value}
    </label>
  );

  return (
    <aside>
      <h2
        className="mb-8 text-[#E1E1E1]"
        style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: 24 }}
      >
        Filter
      </h2>

      <div className="mb-8">
        <h3
          className="mb-4 text-[#E1E1E1]"
          style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: 18 }}
        >
          Product
        </h3>
        <ul className="flex flex-col gap-4">
          {categories.map((c) => (
            <li key={c}>{renderRadio("product", c)}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3
          className="mb-4 text-[#E1E1E1]"
          style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: 18 }}
        >
          Theme
        </h3>
        <ul className="flex flex-col gap-4">
          {themes.map((t) => (
            <li key={t}>{renderRadio("theme", t)}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default function ShopListingSection() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const items = await listShop();
        const mapped = items.map(mapShopToProduct);
        setData(mapped);
      } catch (e: any) {
        setError(e?.message || "Failed to load shop items");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const [filters, setFilters] = useState<FilterState>({ product: "All", theme: "All" });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = data.filter((p) => {
    const byCat = filters.product === "All" || p.category === filters.product;
    const byTheme = filters.theme === "All" || p.theme === filters.theme;
    return byCat && byTheme;
  });

  return (
    <div className="relative overflow-hidden mt-5">
      {error && <div className="text-red-400 px-8">{error}</div>}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-0"
        style={{
          width: "5000px",
          height: "1400px",
          backgroundImage: "url('/assets/aset untuk background di shop item33.png')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left bottom",
          transform: "translateY(100px)",
        }}
      />

      <section
        className="relative z-10 grid gap-12 px-8 lg:grid-cols-[250px_1fr]"
        style={{ minHeight: "calc(200vh - 220px)" }}
      >
        <FilterSidebar products={data} selected={filters} onChange={setFilters} />

        <div className="w-full">
          <div
            className="grid gap-y-10 gap-x-6 my-8"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}
          >
            {(loading ? [] : filtered).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProduct(p)}
                className="text-center transition-transform hover:scale-[1.01]"
                style={{ cursor: "pointer" }}
              >
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="mb-4 w-full object-cover"
                  style={{ aspectRatio: "190 / 261" }}
                />
                <div className="px-2">
                  <h3
                    className="mb-1 text-[#F5F5F5]"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 32,
                      fontWeight: 400,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {p.title}
                  </h3>

                  <p
                    className="m-0 text-[#E1E1E1]"
                    style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, fontWeight: 600 }}
                  >
                    {p.theme}
                  </p>

                  <p
                    className="m-0 text-[#F5F5F5]"
                    style={{ fontFamily: "'Roboto', sans-serif", fontSize: 18, fontWeight: 500 }}
                  >
                    {p.price}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedProduct && (
        <ProductDetailPopup product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}

function mapShopToProduct(item: ShopItem): Product {
  return {
    id: item.id ?? Math.random().toString(36).slice(2),
    title: item.title,
    category: item.category ?? "Merchandise",
    theme: item.condition ?? item.category ?? "General",
    price: formatIDR(item.price),
    imageUrl: item.image || "/assets/product-images/placeholder.png",
    galleryImages: item.image ? [item.image] : [],
    description: item.description,
    reviews: { rating: 5.0, count: 0 },
  };
}
function formatIDR(n?: number) {
  if (typeof n !== "number") return "—";
  try {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
  } catch { return `Rp ${n}`; }
}