// src/features/home/components/ReadingGuideSection.tsx
import { useEffect, useState, type FC } from "react";
import { Link, generatePath } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { contentApi } from "@/lib/content/api";
import type { ArticleDTO } from "@/lib/content/types";

type CardLike = {
  img: string;
  title: string;
  excerpt: string;
  link: string;
};

const COLS_DESKTOP = "315px 134px 315px 420px";
const ROW_HEIGHT = "340px";
const GAP_REM = 1.5;
const HEADER_MAX_WIDTH_DESKTOP = `calc(315px + 134px + 315px + 420px + ${GAP_REM * 3}rem)`;

const WIDE_POS: Record<number, React.CSSProperties> = {
  0: { gridColumn: "1 / span 2", gridRow: "1" },
  1: { gridColumn: "3", gridRow: "1" },
  2: { gridColumn: "1", gridRow: "2" },
  3: { gridColumn: "2 / span 2", gridRow: "2" },
};

const COMING_SOON_CARD: CardLike = {
  img: "/assets/research/Desain tanpa judul.png",
  title: "NEXT: COMING SOON",
  excerpt: "Soon",
  link: ROUTES.READING_GUIDE_COMING_SOON,
};

const OVERLAY =
  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)";

function normalizeMetaText(input?: string | null): string {
  if (!input) return "";
  let s = String(input).trim();
  s = s.replace(/\\u003C/gi, "<").replace(/\\u003E/gi, ">").replace(/\\u0026/gi, "&").replace(/\\"/g, '"');
  s = s.replace(/^\s*"content"\s*:\s*/i, "");
  s = s.replace(/<[^>]+>/g, " ");
  return s.replace(/\s+/g, " ").trim();
}

const ReadingGuideSection: FC = () => {
  const [vw, setVw] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  const [featured, setFeatured] = useState<CardLike | null>(null);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await contentApi.articles.list();
        const rg = (list as ArticleDTO[]).find(a => (a.category ?? "").toUpperCase() === "READING_GUIDE");
        if (!alive) return;
        if (rg) {
          const to = rg.slug
            ? generatePath(ROUTES.READING_GUIDE_DETAIL, { slug: rg.slug })
            : ROUTES.READING_GUIDE;
          setFeatured({
            img: rg.image ?? "/assets/research/Desain tanpa judul.png",
            title: rg.title ?? "Untitled",
            excerpt: normalizeMetaText(rg.meta_description) || (rg.excerpt ?? "—"),
            link: to,
          });
        } else {
          setFeatured(null);
        }
      } catch {
        setFeatured(null);
      }
    })();
    return () => { alive = false; };
  }, []);

  const isNarrow = vw <= 1200;
  const gridTemplateColumns = isNarrow ? "repeat(2, 1fr)" : COLS_DESKTOP;
  const headerMaxWidth = isNarrow ? "100%" : HEADER_MAX_WIDTH_DESKTOP;
  const featuredImgHeight = isNarrow ? "350px" : `calc(${ROW_HEIGHT} * 2 + ${GAP_REM}rem)`;

  const smallCards: CardLike[] = Array.from({ length: 4 }, () => COMING_SOON_CARD);

  return (
    <section id="reading-guide" aria-labelledby="rg_heading" className="relative mt-50">
      <div aria-hidden className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-black" />

      <div className="relative z-[1] mx-auto flex max-w-[1560px] flex-col items-center px-8 py-6">
        <div className="mb-6 flex w-full items-center justify-between" style={{ maxWidth: headerMaxWidth }}>
          <div className="flex items-center">
            <h2
              id="rg_heading" 
              className="m-0 text-[3rem] text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Reading Guides
            </h2>
            <img
              src="/assets/icon/ReadingGuide_Logo.png"
              alt="Ardhianzy Reading Guide"
              className="ml-4 hidden sm:inline-block h-[clamp(38px,4vw,70px)] w-auto object-contain select-none"
              draggable={false}
            />
          </div>

          <a
            href={ROUTES.READING_GUIDE}
            className="inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 hover:text-black hover:bg-white hover:border-black"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", textDecoration: "none" }}
          >
            SEE ALL <span className="ml-[0.3rem]">→</span>
          </a>
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns,
            gridAutoRows: ROW_HEIGHT,
            gap: `${GAP_REM}rem`,
            width: isNarrow ? "100%" : "fit-content",
            margin: "0 auto",
          }}
        >
          {smallCards.map((item, i) => {
            const itemStyle: React.CSSProperties = isNarrow ? {} : WIDE_POS[i] ?? {};
            return (
              <Link key={`${item.title}-${i}`} to={item.link} className="relative overflow-hidden rounded-[30px]" style={itemStyle} aria-label={item.title}>
                <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
                <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: OVERLAY }} />
                <div className="absolute bottom-6 left-6 right-6 z-[2] flex flex-col items-start text-left text-white">
                  <h3 className="mb-2 text-[1.5rem]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{item.title}</h3>
                  <p className="mb-3 text-[0.9rem] leading-[1.4]" style={{ fontFamily: "'Roboto Condensed', sans-serif", opacity: 0.85 }}>
                    {item.excerpt}
                  </p>
                  <span className="inline-flex items-center text-[0.9rem] underline" style={{ fontFamily: "'Roboto Condensed', sans-serif" }}>
                    view <span className="ml-[0.3rem]">→</span>
                  </span>
                </div>
              </Link>
            );
          })}

          <Link
            to={(featured ?? COMING_SOON_CARD).link}
            className="relative flex flex-col justify-end overflow-hidden rounded-[30px]"
            style={isNarrow ? { gridColumn: "1 / -1" } : { gridColumn: "4", gridRow: "1 / span 2", width: "420px" }}
            aria-label={(featured ?? COMING_SOON_CARD).title}
          >
            <img
              src={(featured ?? COMING_SOON_CARD).img}
              alt={(featured ?? COMING_SOON_CARD).title}
              className="w-full object-cover"
              style={{ height: featuredImgHeight }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: OVERLAY }} />
            <div className="absolute bottom-6 left-6 right-6 z-[2] flex flex-col items-start text-left text-white">
              <h3 className="mb-2 text-[1.5rem]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {(featured ?? COMING_SOON_CARD).title}
              </h3>
              <p className="mb-3 text-[0.9rem] leading-[1.4]" style={{ fontFamily: "'Roboto Condensed', sans-serif", opacity: 0.85 }}>
                {(featured ?? COMING_SOON_CARD).excerpt}
              </p>
              <span className="inline-flex items-center text-[0.9rem] underline" style={{ fontFamily: "'Roboto Condensed', sans-serif" }}>
                view <span className="ml-[0.3rem]">→</span>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReadingGuideSection;