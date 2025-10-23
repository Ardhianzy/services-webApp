// src/features/ideas-tradition/components/IdeasTraditionGridSection.tsx
import { useEffect, useState, type FC } from "react";
import { Link, generatePath } from "react-router-dom";
import { ROUTES } from "@/app/routes";
import { contentApi } from "@/lib/content/api";
import type { ArticleDTO } from "@/lib/content/types";

type IdeaItem = {
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

function words(str: string, max = 28) {
  const parts = (str ?? "").trim().split(/\s+/);
  if (parts.length <= max) return (str ?? "").trim();
  return parts.slice(0, max).join(" ") + "…";
}

function normalizeMetaText(input?: string | null): string {
  if (!input) return "";
  let s = String(input).trim();
  s = s.replace(/\\u003C/gi, "<").replace(/\\u003E/gi, ">").replace(/\\u0026/gi, "&").replace(/\\"/g, '"');
  s = s.replace(/^\s*"content"\s*:\s*/i, "");
  s = s.replace(/<[^>]+>/g, " ");
  return s.replace(/\s+/g, " ").trim();
}

const OVERLAY = "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)";

const PLACEHOLDER: IdeaItem = {
  img: "/assets/research/Desain tanpa judul.png",
  title: "COMING SOON",
  excerpt: "Konten sedang disiapkan. Nantikan artikel terbaru dalam waktu dekat.",
  link: ROUTES.IDEAS_TRADITION_COMING_SOON,
};

const IdeasTraditionGridSection: FC = () => {
  const [vw, setVw] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  const [items, setItems] = useState<IdeaItem[]>([]);
  const [featured, setFeatured] = useState<IdeaItem | null>(null);

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
        const ideasAll = (list as ArticleDTO[])
          .filter(a => (a.category ?? "").toUpperCase() === "IDEAS_AND_TRADITIONS")
          .map<IdeaItem>(a => ({
            img: a.image ?? "/assets/research/Desain tanpa judul.png",
            title: a.title ?? "Untitled",
            excerpt: words(normalizeMetaText(a.meta_description) || a.excerpt || "—", 28),
            link: a.slug ? generatePath(ROUTES.IDEAS_TRADITION_DETAIL, { slug: a.slug }) : ROUTES.IDEAS_TRADITION,
          }));

        const feat = ideasAll[0] ?? PLACEHOLDER;
        const grid: IdeaItem[] = ideasAll.slice(1, 5);
        while (grid.length < 4) grid.push(PLACEHOLDER);

        if (!alive) return;
        setFeatured(feat);
        setItems(grid);
      } catch {
        if (!alive) return;
        setFeatured(PLACEHOLDER);
        setItems([PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER]);
      }
    })();
    return () => { alive = false; };
  }, []);

  const isNarrow = vw <= 1200;
  const gridTemplateColumns = isNarrow ? "repeat(2, 1fr)" : COLS_DESKTOP;
  const headerMaxWidth = isNarrow ? "100%" : HEADER_MAX_WIDTH_DESKTOP;
  const featuredImgHeight = isNarrow ? "350px" : `calc(${ROW_HEIGHT} * 2 + ${GAP_REM}rem)`;

  return (
    <section id="ideas" aria-labelledby="ideas-title" className="relative mt-50">
      <div className="relative mx-auto flex max-w-[1560px] flex-col items-center px-8 py-6" style={{ zIndex: 1 }}>
        <div aria-hidden className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-black" />

        <div className="mb-6 flex w-full items-center justify-between" style={{ maxWidth: headerMaxWidth }}>
          <div className="flex items-center">
            <h2
              id="ideas-title"
              className="m-0 text-[3rem] text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Philosophical Ideas &amp; Tradition
            </h2>
            <img
              src="/assets/icon/IdeasTradition_Logo.png"
              alt="Ardhianzy Ideas & Tradition_Logo"
              className="ml-4 hidden sm:inline-block h-[clamp(38px,4vw,70px)] w-auto object-contain select-none"
              draggable={false}
            />
          </div>
          <a
            href={ROUTES.IDEAS_TRADITION}
            className="inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/60 hover:text-black hover:bg-white hover:border-black"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", textDecoration: "none" }}
            aria-label="See all Ideas & Tradition"
          >
            SEE ALL <span className="ml-2">→</span>
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
            const itemStyle: React.CSSProperties = isNarrow ? {} : (WIDE_POS[i] ?? {});
            return (
              <Link key={`${item.title}-${i}`} to={item.link} className="relative overflow-hidden rounded-[30px] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow" style={itemStyle} aria-label={item.title}>
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

          {featured && (
            <Link
              to={featured.link}
              className="relative flex flex-col justify-end overflow-hidden rounded-[30px] hover:shadow-[0_12px_40px_rgba(255,255,255,0.15)] transition-shadow"
              style={isNarrow ? { gridColumn: "1 / -1" } : { gridColumn: "4", gridRow: "1 / span 2", width: "400px" }}
              aria-label={featured.title}
            >
              <img src={featured.img} alt={featured.title} className="w-full object-cover" style={{ height: featuredImgHeight }} />
              <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: OVERLAY }} />
              <div className="absolute bottom-6 left-6 right-6 z-[2] flex flex-col items-start text-left text-white">
                <h3 className="mb-2 text-[1.5rem]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{featured.title}</h3>
                <p className="mb-3 text-[0.9rem] leading-[1.4]" style={{ fontFamily: "'Roboto Condensed', sans-serif", opacity: 0.85 }}>
                  {featured.excerpt}
                </p>
                <span className="inline-flex items-center text-[0.9rem] underline" style={{ fontFamily: "'Roboto Condensed', sans-serif" }}>
                  view <span className="ml-[0.3rem]">→</span>
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default IdeasTraditionGridSection;