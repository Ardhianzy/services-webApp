// src/features/ideas-tradition/components/HighlightSection.tsx
import { useEffect, useMemo, useState, type FC } from "react";
import { articles as dataArticles } from "@/data/articles";

type ArticleCard = {
  id: string | number;
  title: string;
  description: string;
  image: string;
};

const BG_IMAGE = "/assets/ideas&tradition/Groupkdfk.png";
const LEFT_GRADIENT =
  "linear-gradient(to right, #000 30%, transparent 100%)";
const RIGHT_GRADIENT =
  "linear-gradient(to left, #000 30%, transparent 100%)";
const CARD_OVERLAY =
  "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)";

function getCardMetrics(vw: number) {
  if (vw <= 768) {
    return {
      width: "95vw",
      heightClass: "h-[300px]",
      gapPx: 15,
      titleSizeRem: 2.5,
      bodySizeRem: 0.9,
      padding: "20px 25px",
    };
  }
  if (vw <= 1200) {
    return {
      width: "90vw",
      heightClass: "h-[350px]",
      gapPx: 20,
      titleSizeRem: 3.0,
      bodySizeRem: 1.0,
      padding: "30px 40px",
    };
  }
  return {
    width: "1029px",
    heightClass: "h-[417px]",
    gapPx: 30,
    titleSizeRem: 3.5,
    bodySizeRem: 1.0,
    padding: "30px 40px",
  };
}

const IdeasTraditionHero: FC = () => (
  <section
    className={[
      "relative left-1/2 -translate-x-1/2 w-screen",
      "h-[60vh] bg-black bg-cover bg-center bg-blend-luminosity",
      "flex items-center justify-center",
    ].join(" ")}
    style={{ backgroundImage: `url('${BG_IMAGE}')` }}
  >
    <div
      className="absolute inset-0 z-[1]"
      style={{
        background:
          "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, transparent 100%)",
      }}
    />
    <h1
      className="relative z-[2] text-white text-center uppercase font-['Bebas Neue',cursive]"
      style={{ fontSize: "5rem" }}
    >
      IDEAS & TRADITION
    </h1>
  </section>
);

const ArrowButton: FC<{
  side: "left" | "right";
  label: string;
  onClick: () => void;
}> = ({ side, label, onClick }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()}
    className={[
      "absolute z-10 top-1/2 -translate-y-1/2",
      side === "left" ? "left-[40px]" : "right-[40px]",
      "w-[50px] h-[50px] rounded-full",
      "flex items-center justify-center",
      "text-white text-[2.2rem] leading-none pb-[4px]",
      "transition",
    ].join(" ")}
    style={{
      backgroundColor: "rgba(0,0,0,0.4)",
      border: "1px solid rgba(255,255,255,0.2)",
    }}
  >
    {side === "left" ? "\u2039" : "\u203A"}
  </button>
);

const HighlightCard: FC<{
  data: ArticleCard;
  active: boolean;
  heightClass: string;
  titleSizeRem: number;
  bodySizeRem: number;
  padding: string;
}> = ({ data, active, heightClass, titleSizeRem, bodySizeRem, padding }) => (
  <article
    aria-current={active ? "true" : undefined}
    className={[
      "group relative overflow-hidden cursor-pointer bg-[#111111]",
      "flex-shrink-0 w-[min(1029px,95vw)]",
      heightClass,
      "transition duration-400 ease-in-out",
      "scale-[0.85] opacity-50",
      "hover:scale-[1.02] hover:opacity-100 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
      active ? "scale-100 opacity-100" : "",
    ].join(" ")}
  >
    <img
      src={data.image}
      alt={data.title}
      loading="lazy"
      className="w-full h-full object-cover grayscale transition duration-300 ease-in-out group-hover:grayscale-0"
    />
    <div
      className="absolute inset-0 text-white flex flex-col justify-start items-start"
      style={{ background: CARD_OVERLAY, padding }}
    >
      <h3
        className="uppercase mb-[10px] font-['Bebas Neue',cursive]"
        style={{
          fontWeight: 400,
          fontSize: `${titleSizeRem}rem`,
          lineHeight: 1,
          letterSpacing: "2px",
          maxWidth: 500,
        }}
      >
        {data.title}
      </h3>
      <p
        className="opacity-90 font-['Arial',sans-serif]"
        style={{
          fontWeight: 400,
          fontSize: `${bodySizeRem}rem`,
          lineHeight: 1.6,
          maxWidth: 450,
          textAlign: "left",
        }}
      >
        {data.description}
      </p>
    </div>
  </article>
);

const IdeasTraditionHighlightSection: FC = () => {
  const [vw, setVw] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const ITEMS: ArticleCard[] = useMemo(
    () =>
      dataArticles
        .filter(
          (a) => a.section === "ideas-tradition" && a.category === "Highlight"
        )
        .map((a) => ({
          id: a.id,
          title: a.title,
          description: a.excerpt,
          image: a.image ?? a.cover,
        })),
    []
  );

  const [currentIndex, setCurrentIndex] = useState<number>(2);
  const safeIndex = ITEMS.length
    ? Math.min(currentIndex, ITEMS.length - 1)
    : 0;

  const { width, heightClass, gapPx, titleSizeRem, bodySizeRem, padding } =
    getCardMetrics(vw);

  const sliderTransform = useMemo(() => {
    return `translateX(calc(50% - (${width} / 2) - (${safeIndex} * (${width} + ${gapPx}px))))`;
  }, [width, gapPx, safeIndex]);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? Math.max(ITEMS.length - 1, 0) : prev - 1));
  const handleNext = () =>
    setCurrentIndex((prev) =>
      prev === Math.max(ITEMS.length - 1, 0) ? 0 : prev + 1
    );

  return (
    <div className="relative">
      <IdeasTraditionHero />

      <section
        className="relative w-full bg-black py-[20px] overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Ideas & Tradition highlights"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[3]"
          style={{ width: "15%", maxWidth: 200, background: LEFT_GRADIENT }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-[3]"
          style={{ width: "15%", maxWidth: 200, background: RIGHT_GRADIENT }}
        />

        <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
          {ITEMS.length > 1 && (
            <ArrowButton side="left" label="Previous article" onClick={handlePrev} />
          )}

          <div className="relative w-full h-[417px] overflow-visible">
            <div
              className="relative flex h-full items-center transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ gap: `${gapPx}px`, transform: sliderTransform }}
            >
              {ITEMS.map((a, idx) => (
                <HighlightCard
                  key={a.id}
                  data={a}
                  active={idx === safeIndex}
                  heightClass={heightClass}
                  titleSizeRem={titleSizeRem}
                  bodySizeRem={bodySizeRem}
                  padding={padding}
                />
              ))}
            </div>
          </div>

          {ITEMS.length > 1 && (
            <ArrowButton side="right" label="Next article" onClick={handleNext} />
          )}
        </div>
      </section>
    </div>
  );
};

export default IdeasTraditionHighlightSection;
export { IdeasTraditionHighlightSection as HighlightSection };