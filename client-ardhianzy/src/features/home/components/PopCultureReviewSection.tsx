// src/features/home/components/PopCultureReviewSection.tsx
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
  img: "/assets/icon/Ardhianzy_Logo_2.png",
  title: "NEXT: COMING SOON",
  excerpt: "Popsophia in Progress",
  link: ROUTES.POP_CULTURE_REVIEW_COMING_SOON,
};

const OVERLAY = "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)";

function normalizeMetaText(input?: string | null): string {
  if (!input) return "";
  let s = String(input).trim();
  s = s
    .replace(/\\u003C/gi, "<")
    .replace(/\\u003E/gi, ">")
    .replace(/\\u0026/gi, "&")
    .replace(/\\"/g, '"');
  s = s.replace(/^\s*"content"\s*:\s*/i, "");
  s = s.replace(/<[^>]+>/g, " ");
  return s.replace(/\s+/g, " ").trim();
}

function previewClamp(text: string, maxWords = 40) {
  const parts = (text ?? "").split(/\s+/).filter(Boolean);
  const truncated = parts.length > maxWords;
  const preview = truncated ? parts.slice(0, maxWords).join(" ") : parts.join(" ");
  return { preview, truncated };
}

function ContinueReadInline() {
  return (
    <span className="ml-2 inline-flex items-center underline underline-offset-4 decoration-white/60 group-hover:decoration-white">
      Continue to Read&nbsp;→
    </span>
  );
}

const PopCultureReviewSection: FC = () => {
  const [vw, setVw] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1920
  );

  const [featured, setFeatured] = useState<CardLike>(COMING_SOON_CARD);
  const [items, setItems] = useState<CardLike[]>([COMING_SOON_CARD, COMING_SOON_CARD, COMING_SOON_CARD, COMING_SOON_CARD]);

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
        const popAll = (list as ArticleDTO[])
          .filter(a => (a.category ?? "").toUpperCase() === "POP_CULTURE")
          .map<CardLike>(a => ({
            img: a.image ?? "/assets/research/Desain tanpa judul.png",
            title: a.title ?? "Untitled",
            excerpt: normalizeMetaText(a.meta_description) || (a.excerpt ?? "—"),
            link: a.slug ? generatePath(`${ROUTES.POP_CULTURE_REVIEW}/:slug`, { slug: a.slug }) : ROUTES.POP_CULTURE_REVIEW,
          }));

        const latest = popAll.slice(0, 5);
        while (latest.length < 5) latest.push(COMING_SOON_CARD);

        if (!alive) return;
        setFeatured(latest[0]);

        const grid: CardLike[] = [COMING_SOON_CARD, COMING_SOON_CARD, COMING_SOON_CARD, COMING_SOON_CARD];
        grid[1] = latest[1] ?? COMING_SOON_CARD;
        grid[0] = latest[2] ?? COMING_SOON_CARD;
        grid[3] = latest[3] ?? COMING_SOON_CARD;
        grid[2] = latest[4] ?? COMING_SOON_CARD;
        setItems(grid);
      } catch {
        if (!alive) return;
        setFeatured(COMING_SOON_CARD);
        setItems([COMING_SOON_CARD, COMING_SOON_CARD, COMING_SOON_CARD, COMING_SOON_CARD]);
      }
    })();
    return () => { alive = false; };
  }, []);

  const isNarrow = vw <= 1200;
  const gridTemplateColumns = isNarrow ? "repeat(2, 1fr)" : COLS_DESKTOP;
  const headerMaxWidth = isNarrow ? "100%" : HEADER_MAX_WIDTH_DESKTOP;
  const featuredImgHeight = isNarrow ? "350px" : `calc(${ROW_HEIGHT} * 2 + ${GAP_REM}rem)`;

  const { preview: featPrev, truncated: featCut } = previewClamp(featured.excerpt, 40);

  return (
    <section id="popsophia" aria-labelledby="pop_heading" className="relative mt-50">
      <div aria-hidden className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-black" />
      <div className="relative z-[1] mx-auto flex max-w-[1560px] flex-col items-center px-8 py-6">
        <div className="mb-6 flex w-full items-center justify-between" style={{ maxWidth: headerMaxWidth }}>
          <div className="flex items-center">
            <img
              src="/assets/icon/Popshopia_Logo.png"
              alt="Ardhianzy Popsophia"
              className="hidden sm:inline-block h-[clamp(38px,4vw,70px)] w-auto object-contain select-none"
              draggable={false}
            />
            <h2 id="pop_heading" className="ml-4 text-[3rem] text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Popsophia
            </h2>
          </div>
          <a
            href={ROUTES.POP_CULTURE_REVIEW}
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
          {items.map((item, i) => {
            const itemStyle: React.CSSProperties = isNarrow ? {} : WIDE_POS[i] ?? {};
            const { preview, truncated } = previewClamp(item.excerpt, 36);
            return (
              <div key={`${item.title}-${i}`} className="relative overflow-hidden rounded-[30px] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow border-1" style={itemStyle} aria-label={item.title}>
                <img src={item.img} alt={item.title} className="h-full w-full object-contain p-24" />
                <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: OVERLAY }} />
                <div className="absolute bottom-6 left-6 right-6 z-[2] flex flex-col items-start text-left text-white">
                  <h3 className="mb-2 text-[1.5rem]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{item.title}</h3>
                  <p className="mb-3 text-[0.9rem] leading-[1.4] line-clamp-3" style={{ fontFamily: "'Roboto Condensed', sans-serif", opacity: 0.85 }}>
                    {preview}{truncated && "…"}
                    {truncated && (
                      <Link to={item.link}><ContinueReadInline /></Link>
                    )}
                  </p>
                </div>
              </div>
            );
          })}

          <Link
            to={featured.link}
            className="relative flex flex-col justify-end overflow-hidden rounded-[30px] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow"
            style={isNarrow ? { gridColumn: "1 / -1" } : { gridColumn: "4", gridRow: "1 / span 2", width: "420px" }}
            aria-label={featured.title}
          >
            <img
              src={featured.img}
              alt={featured.title}
              className="w-full object-cover"
              style={{ height: featuredImgHeight }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: OVERLAY }} />
            <div className="absolute bottom-6 left-6 right-6 z-[2] flex flex-col items-start text-left text-white">
              <h3 className="mb-2 text-[1.5rem]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {featured.title}
              </h3>
              <p className="mb-3 text-[0.9rem] leading-[1.4] line-clamp-3" style={{ fontFamily: "'Roboto Condensed', sans-serif", opacity: 0.85 }}>
                {featPrev}{featCut && "…"}{featCut && <ContinueReadInline />}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopCultureReviewSection;