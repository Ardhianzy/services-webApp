// src/features/research/components/ResearchHighlightSection.tsx
import { useMemo, useState, useEffect, type CSSProperties } from "react";
import { articles as allArticles } from "@/data/articles";

export type ResearchHighlightArticle = {
  id: number | string;
  title: string;
  description: string;
  image: string;
};

type Props = {
  articles?: ResearchHighlightArticle[];
  headingTitle?: string;
  headingBackgroundUrl?: string;
  initialIndex?: number;
};

export default function ResearchHighlightSection({
  articles,
  headingTitle = "RESEARCH",
  headingBackgroundUrl = "/assets/Group 4981.svg",
  initialIndex = 2,
}: Props) {
  const storeItems = useMemo<ResearchHighlightArticle[]>(
    () =>
      allArticles
        .filter((a) => a.section === "research" && a.category === "Highlight")
        .map((a) => ({
          id: a.id,
          title: a.title,
          description: a.excerpt,
          image: a.image ?? a.cover,
        })),
    []
  );

  const items = articles && articles.length > 0 ? articles : storeItems;

  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0))
  );
  useEffect(() => {
    setCurrentIndex((prev) =>
      items.length ? Math.min(prev, items.length - 1) : 0
    );
  }, [items.length]);

  const sliderVars: CSSProperties = { ["--current-index" as any]: currentIndex };

  const goPrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  const goNext = () =>
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  return (
    <>
      <section
        className="relative flex h-[60vh] w-screen items-center justify-center bg-center bg-cover"
        style={{
          backgroundImage: `url('${headingBackgroundUrl}')`,
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
        }}
      >
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, transparent 100%)",
          }}
        />
        <h1
          className="relative z-[2] text-white uppercase text-center"
          style={{ fontFamily: '"Bebas Neue", cursive', fontSize: "5rem" }}
        >
          {headingTitle}
        </h1>
      </section>

      <section className="relative w-full bg-black py-5 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-[3]"
          style={{
            width: "15%",
            maxWidth: 200,
            background: "linear-gradient(to right, #000 30%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-[3]"
          style={{
            width: "15%",
            maxWidth: 200,
            background: "linear-gradient(to left, #000 30%, transparent 100%)",
          }}
        />

        <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
          <button
            type="button"
            aria-label="Previous article"
            onClick={goPrev}
            className="absolute left-10 z-10 flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-white text-[1.5rem] transition-all hover:scale-110 hover:bg-white/20 max-[768px]:left-2 max-[768px]:h-[45px] max-[768px]:w-[45px] max-[768px]:text-[1.2rem]"
          >
            &#8249;
          </button>

          <div className="relative h-[417px] w-full overflow-visible">
            <div
              className="rs-article-slider flex h-full items-center gap-[30px] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={sliderVars}
            >
              {items.map((article, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <article
                    key={article.id}
                    className={[
                      "relative h-[417px] w-[1029px] shrink-0 cursor-pointer overflow-hidden bg-[#111] transition-all duration-300",
                      "max-[1200px]:h-[350px] max-[1200px]:w-[90vw]",
                      "max-[768px]:h-[300px] max-[768px]:w-[95vw]",
                      isActive ? "opacity-100 scale-100" : "opacity-50 scale-95",
                      "hover:scale-[1.02] hover:opacity-100 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
                    ].join(" ")}
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-[filter] duration-300 filter grayscale hover:grayscale-0"
                    />

                    <div
                      className="absolute inset-0 flex flex-col items-start justify-start p-[30px] pr-[40px] text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
                      }}
                    >
                      <h3
                        className="mb-[10px] uppercase"
                        style={{
                          fontFamily: '"Bebas Neue", cursive',
                          fontSize: "3.5rem",
                          lineHeight: 1,
                          letterSpacing: "2px",
                          maxWidth: 500,
                        }}
                      >
                        {article.title}
                      </h3>
                      <p
                        className="text-left opacity-90"
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontSize: "1rem",
                          lineHeight: 1.6,
                          maxWidth: 450,
                        }}
                      >
                        {article.description}
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
            onClick={goNext}
            className="absolute right-10 z-10 flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 border-white/30 bg-white/10 text-white text-[1.5rem] transition-all hover:scale-110 hover:bg-white/20 max-[768px]:right-2 max-[768px]:h-[45px] max-[768px]:w-[45px] max-[768px]:text-[1.2rem]"
          >
            &#8250;
          </button>
        </div>
      </section>

      <style>{`
        .rs-article-slider {
          /* default (desktop) */
          --card-w: 1029px;
          --card-gap: 30px;

          /* geser sehingga kartu aktif selalu center */
          transform: translateX(
            calc(50% - (var(--card-w) / 2) - (var(--current-index) * (var(--card-w) + var(--card-gap))))
          );
        }
        @media (max-width: 1200px) {
          .rs-article-slider {
            --card-w: 90vw;
            --card-gap: 20px;
          }
        }
        @media (max-width: 768px) {
          .rs-article-slider {
            --card-w: 95vw;
            --card-gap: 15px;
          }
        }
      `}</style>
    </>
  );
}