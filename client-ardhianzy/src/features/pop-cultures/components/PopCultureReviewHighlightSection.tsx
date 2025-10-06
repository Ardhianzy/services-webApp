// src/features/pop-culture/components/PopCultureReviewHighlightSection.tsx
import { useMemo, useState, type CSSProperties } from "react";
import { articles as dataArticles } from "@/data/articles";

type ArticleCard = {
  id: number | string;
  title: string;
  description: string;
  image: string;
};

type Props = {
  articles?: ArticleCard[];
  title?: string;
  heroImageUrl?: string;
};

const CARD_W = 1029;
const CARD_H = 417;

export default function PopCultureReviewHighlightSection({
  articles,
  title = "POP-CULTURE REVIEW",
  heroImageUrl = "/assets/PopCulture/dadasdfe.png",
}: Props) {
  const itemsFromCenter: ArticleCard[] = useMemo(
    () =>
      dataArticles
        .filter((a) => a.section === "pop-cultures" && a.category === "Highlight")
        .map((a) => ({
          id: a.id,
          title: a.title,
          description: a.excerpt,
          image: a.image ?? a.cover,
        })),
    []
  );

  const source: ArticleCard[] = (articles?.length ? articles : itemsFromCenter) as ArticleCard[];
  if (!source.length) return null;

  const initialIndex = Math.min(2, Math.max(0, source.length - 1));
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const cssVar: CSSProperties = { ["--current-index" as any]: currentIndex };

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? source.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === source.length - 1 ? 0 : prev + 1));

  return (
    <div className="pc-review-highlight-wrapper">
      <section
        aria-label="Pop-culture highlight hero"
        className="relative w-screen h-[60vh] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-black bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('${heroImageUrl}')`, backgroundBlendMode: "luminosity" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, transparent 100%)",
          }}
        />
        <h1
          className="relative z-[2] uppercase text-center"
          style={{ fontFamily: '"Bebas Neue", cursive', fontSize: "5rem", color: "#fff" }}
        >
          {title}
        </h1>
      </section>

      <section className="relative w-full py-5 bg-black overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[3]"
          style={{ width: "15%", maxWidth: 200, background: "linear-gradient(to right, #000 30%, transparent 100%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-[3]"
          style={{ width: "15%", maxWidth: 200, background: "linear-gradient(to left, #000 30%, transparent 100%)" }}
        />

        <div className="relative mx-auto flex items-center justify-center w-full">
          <button
            type="button"
            aria-label="Previous article"
            onClick={handlePrev}
            className="absolute top-1/2 -translate-y-1/2 left-10 z-10 w-[50px] h-[50px] rounded-full border border-white/20 bg-black/40 text-white text-[2.2rem] leading-[0] pb-[4px] flex items-center justify-center transition hover:bg-black/70 hover:scale-105"
          >
            &#8249;
          </button>

          <div className="relative w-full h-[417px] overflow-visible">
            <div
              className="pc-review-slider relative flex h-full items-center gap-[30px] transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={cssVar}
            >
              {source.map((a, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <article
                    key={a.id}
                    className="pc-article-card relative overflow-hidden cursor-pointer bg-[#111] transition-all duration-300 will-change-transform"
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      width: `${CARD_W}px`,
                      height: `${CARD_H}px`,
                      transform: isActive ? "scale(1)" : "scale(0.85)",
                      opacity: isActive ? 1 : 0.5,
                    }}
                  >
                    <img
                      src={a.image}
                      alt={a.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition"
                      style={{ filter: "grayscale(100%)" }}
                    />
                    <div
                      className="absolute inset-0 text-white flex flex-col justify-start items-start"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
                        padding: "30px 40px",
                      }}
                    >
                      <h3
                        className="uppercase mb-[10px] tracking-[2px]"
                        style={{
                          fontFamily: '"Bebas Neue", cursive',
                          fontWeight: 400,
                          fontSize: "3.5rem",
                          lineHeight: 1,
                          maxWidth: 500,
                        }}
                      >
                        {a.title}
                      </h3>
                      <p
                        className="text-left opacity-90"
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontWeight: 400,
                          fontSize: "1rem",
                          lineHeight: 1.6,
                          maxWidth: 450,
                        }}
                      >
                        {a.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            aria-label="Next article"
            onClick={handleNext}
            className="absolute top-1/2 -translate-y-1/2 right-10 z-10 w-[50px] h-[50px] rounded-full border border-white/20 bg-black/40 text-white text-[2.2rem] leading-[0] pb-[4px] flex items-center justify-center transition hover:bg-black/70 hover:scale-105"
          >
            &#8250;
          </button>
        </div>
      </section>

      <style>{`
        /* Desktop: kartu 1029px + gap 30px */
        .pc-review-highlight-wrapper .pc-review-slider {
          transform: translateX(calc(50% - (${CARD_W}px / 2) - (var(--current-index) * (${CARD_W}px + 30px))));
        }

        /* Hover: scale + bayangan + warna gambar */
        .pc-review-highlight-wrapper .pc-article-card:hover {
          transform: scale(1.02) !important;
          opacity: 1 !important;
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .pc-review-highlight-wrapper .pc-article-card:hover img {
          filter: grayscale(0%);
        }

        /* <=1200px: 90vw + gap 20px; tinggi 350px */
        @media (max-width: 1200px) {
          .pc-review-highlight-wrapper .pc-review-slider {
            gap: 20px;
            transform: translateX(calc(50% - (90vw / 2) - (var(--current-index) * (90vw + 20px))));
          }
          .pc-review-highlight-wrapper .pc-article-card {
            width: 90vw !important;
            height: 350px !important;
          }
        }

        /* <=768px: 95vw + gap 15px; tinggi 300px; font menyesuaikan */
        @media (max-width: 768px) {
          .pc-review-highlight-wrapper .pc-review-slider {
            gap: 15px;
            transform: translateX(calc(50% - (95vw / 2) - (var(--current-index) * (95vw + 15px))));
          }
          .pc-review-highlight-wrapper .pc-article-card {
            width: 95vw !important;
            height: 300px !important;
          }
          .pc-review-highlight-wrapper .pc-article-card h3 {
            font-size: 2.5rem !important;
            margin-bottom: 8px !important;
          }
          .pc-review-highlight-wrapper .pc-article-card p {
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </div>
  );
}