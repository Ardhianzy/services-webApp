// src/features/articles/components/RelatedArticles.tsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useHybridArticles } from "@/features/articles/hooks";
import type { ArticleSection } from "@/data/articles";

const CARD_WIDTH = 299;
const CARD_GAP = 30;
const GRADIENT_W = 50;
const HEADER_BAR_W = 13;
const HEADER_BAR_H = 77;

type RelatedCard = {
  id: string | number;
  title: string;
  date: string;
  image: string;
  excerpt: string;
};

type Props = {
  articles?: RelatedCard[];
  section?: ArticleSection;
  excludeIds?: Array<string | number>;
  perPage?: number;
};

function prettyDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const month = d.toLocaleString("en-US", { month: "long" });
  const day = String(d.getDate()).padStart(2, "0");
  return `${day} ${month}, ${d.getFullYear()}`;
}

export default function RelatedArticles({
  articles,
  section = "research",
  excludeIds = [],
  perPage = 4,
}: Props) {
  const { articles: hybrid } = useHybridArticles();

  const centerItems: RelatedCard[] = useMemo(() => {
    return hybrid
      .filter((a: any) => a.section === section && a.category !== "Highlight")
      .filter((a: any) => !excludeIds.map(String).includes(String(a.id)))
      .map((a: any) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        date: prettyDate(a.publishedAt),
        image: a.image ?? a.cover,
        excerpt: a.excerpt ?? "",
      }));
  }, [hybrid, section, excludeIds]);

  const list: RelatedCard[] =
    articles && articles.length > 0 ? articles : centerItems;

  const [currentPage, setCurrentPage] = useState(0);
  if (!list || list.length === 0) return null;

  const totalPages = Math.ceil(list.length / (perPage || 1));
  const slideWidth = CARD_WIDTH * (perPage || 1) + CARD_GAP * ((perPage || 1) - 1);

  const handleNext = () => setCurrentPage((p) => (p + 1) % totalPages);
  const handlePrev = () => setCurrentPage((p) => (p === 0 ? totalPages - 1 : p - 1));

  return (
    <section className="w-full bg-black text-white py-20 overflow-hidden" role="region" aria-label="Related articles">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;400;600&display=swap');
        .ra__bebas { font-family: 'Bebas Neue', cursive !important; }
        .ra__roboto { font-family: 'Roboto', sans-serif !important; }
      `}</style>

      <div className="max-w-[1275px] mx-auto px-5">
        <header className="flex items-center gap-5 mb-10 ml-0">
          <div className="bg-white" style={{ width: HEADER_BAR_W, height: HEADER_BAR_H }} aria-hidden="true" />
          <h2 className="m-0 ra__bebas !text-[64px] !leading-[77px] !font-normal">OTHERS</h2>
        </header>

        <div className="relative" aria-roledescription="carousel">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20" style={{ width: GRADIENT_W, background: "linear-gradient(to right, #000 20%, rgba(0,0,0,0) 100%)" }} aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20" style={{ width: GRADIENT_W, background: "linear-gradient(to left, #000 20%, rgba(0,0,0,0) 100%)" }} aria-hidden="true" />

          {totalPages > 1 && (
            <button
              type="button"
              aria-label="Previous Articles"
              onClick={handlePrev}
              className="absolute top-1/2 -translate-y-1/2 left-[-50px] z-30 grid place-items-center !w-[50px] !h-[50px] !rounded-full !p-0 text-[#F5F5F5] text-[2rem] !leading-[0] font-light transition-all hover:!scale-105 active:!scale-95"
              style={{ background: "rgba(177,177,177,0.2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(177,177,177,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(177,177,177,0.2)")}
            >
              <span aria-hidden>&#8249;</span>
            </button>
          )}

          <div className="overflow-hidden w-full">
            <div
              className="flex"
              style={{
                gap: CARD_GAP,
                transform: `translateX(-${currentPage * slideWidth}px)`,
                transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              aria-live="polite"
            >
              {list.map((article) => {
                const snippet = (article.excerpt || "").substring(0, 100);
                return (
                  <article key={article.id} className="flex-shrink-0 text-center flex flex-col" style={{ width: CARD_WIDTH }}>
                    <img src={article.image} alt={article.title} className="w-full h-[194px] object-cover grayscale mb-[15px]" loading="lazy" />
                    <div className="flex flex-col items-center gap-2 flex-grow">
                      <p className="m-0 ra__roboto !text-[14px] text-[#B3B3B3] !font-light">{article.date}</p>
                      <h3 className="m-0 ra__bebas !text-[32px] !leading-[1.1] !font-normal">{article.title}</h3>
                      <p className="mb-auto overflow-hidden ra__roboto !text-[14px] !leading-[1.4]" style={{ height: "4.2em" }}>
                        {snippet}...
                      </p>
                      <Link to={`/read/${(article as any).slug ?? article.id}`} className="flex items-center gap-[5px] underline text-white ra__roboto !text-[15px] !font-semibold" style={{ marginTop: 15 }}>
                        Continue Read <span className="inline-block">→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {totalPages > 1 && (
            <button
              type="button"
              aria-label="Next Articles"
              onClick={handleNext}
              className="absolute top-1/2 -translate-y-1/2 right-[-50px] z-30 grid place-items-center !w-[50px] !h-[50px] !rounded-full !p-0 text-[#F5F5F5] text-[2rem] !leading-[0] font-light transition-all hover:!scale-105 active:!scale-95"
              style={{ background: "rgba(177,177,177,0.2)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(177,177,177,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(177,177,177,0.2)")}
            >
              <span aria-hidden>&#8250;</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}