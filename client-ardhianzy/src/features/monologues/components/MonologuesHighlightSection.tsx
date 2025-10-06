// src/features/monologues/components/MonologuesHighlightSection.tsx
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { articles as dataArticles } from "@/data/articles";

export type HighlightArticle = {
  id: string | number;
  title: string;
  description: string;
  image: string;
};

type Props = {
  articles?: HighlightArticle[];
};

export default function MonologuesHighlightSection({ articles }: Props) {
  const itemsFromCenter: HighlightArticle[] = useMemo(
    () =>
      dataArticles
        .filter((a) => a.section === "monologues" && a.category === "Highlight")
        .map((a) => ({
          id: a.id,
          title: a.title,
          description: a.excerpt,
          image: a.image ?? a.cover,
        })),
    []
  );

  const source = (articles?.length ? articles : itemsFromCenter) as HighlightArticle[];

  const initialIndex = Math.min(2, Math.max(0, source.length - 1));
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  useEffect(() => {
    setCurrentIndex((idx) => {
      const max = Math.max(0, source.length - 1);
      return Math.min(idx, max);
    });
  }, [source.length]);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? source.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev === source.length - 1 ? 0 : prev + 1));

  const sliderStyle = { ["--current-index" as any]: currentIndex } as CSSProperties;

  if (!source.length) return null;

  return (
    <div className="monologues-highlight-wrapper">
      <section
        aria-label="Monologues hero"
        className="
          relative w-screen h-[60vh]
          left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
          flex items-center justify-center
          bg-black bg-cover bg-center
        "
        style={{
          backgroundImage: "url('/assets/Group 515432_waifu2x_art_noise3_scale.png')",
          backgroundBlendMode: "luminosity",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, transparent 100%)",
          }}
        />
        <h1 className='relative z-[2] text-white font-["Bebas Neue"] text-[5rem] uppercase text-center'>
          MONOLOGUES
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

        <div className="relative mx-auto flex w-full items-center justify-center">
          <button
            type="button"
            aria-label="Previous article"
            onClick={handlePrev}
            className="absolute left-10 z-10 flex h-[50px] w-[50px] items-center justify-center rounded-full border border-white/20 bg-black/40 pb-1 text-[2.2rem] leading-[0] text-white transition hover:scale-105 hover:bg-black/70"
          >
            &#8249;
          </button>

          <div className="relative h-[417px] w-full overflow-visible">
            <div
              className="mhl-slider relative flex h-full items-center gap-[30px] transition-transform duration-300"
              style={sliderStyle}
            >
              {source.map((a, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <article
                    key={a.id}
                    className={[
                      "mhl-card group relative h-[417px] w-[1029px] cursor-pointer overflow-hidden bg-[#111] flex-shrink-0",
                      "transition duration-300 ease-out",
                      isActive ? "scale-100 opacity-100" : "scale-95 opacity-50",
                      "hover:scale-[1.02] hover:opacity-100 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
                    ].join(" ")}
                  >
                    <img
                      src={a.image}
                      alt={a.title}
                      className="h-full w-full object-cover transition group-hover:grayscale-0 grayscale"
                    />

                    <div
                      className="absolute inset-0 flex max-w-none flex-col items-start justify-start text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
                        padding: "30px 40px",
                      }}
                    >
                      <h3 className='mb-[10px] max-w-[500px] font-["Bebas Neue"] text-[3.5rem] font-normal leading-[1] uppercase tracking-[2px]'>
                        {a.title}
                      </h3>
                      <p
                        className="max-w-[450px] text-left opacity-90"
                        style={{ fontFamily: "Arial, sans-serif", lineHeight: 1.6, fontSize: "1rem" }}
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
            className="absolute right-10 z-10 flex h-[50px] w-[50px] items-center justify-center rounded-full border border-white/20 bg-black/40 pb-1 text-[2.2rem] leading-[0] text-white transition hover:scale-105 hover:bg-black/70"
          >
            &#8250;
          </button>
        </div>
      </section>

      <style>{`
        /* Desktop default: card 1029px + gap 30px */
        .mhl-slider {
          transform: translateX(calc(50% - (1029px / 2) - (var(--current-index) * (1029px + 30px))));
          transition: transform .6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        /* <=1200px: 90vw + gap 20px, tinggi 350px */
        @media (max-width: 1200px) {
          .mhl-slider {
            gap: 20px;
            transform: translateX(calc(50% - (90vw / 2) - (var(--current-index) * (90vw + 20px))));
          }
          .mhl-card {
            width: 90vw;
            height: 350px;
          }
        }
        /* <=768px: 95vw + gap 15px, tinggi 300px */
        @media (max-width: 768px) {
          .mhl-slider {
            gap: 15px;
            transform: translateX(calc(50% - (95vw / 2) - (var(--current-index) * (95vw + 15px))));
          }
          .mhl-card {
            width: 95vw;
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
}