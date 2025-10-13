// src/features/ideas-tradition/components/IdeasTraditionGridSection.tsx
import { useEffect, useState, type FC } from "react";

type IdeaItem = {
  img: string;
  title: string;
  excerpt: string;
  link: string;
};

const IDEAS: IdeaItem[] = [
  {
    img: "/assets/research/Desain tanpa judul.png",
    title: "LOREM IPSUM DOLOR SIT",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    link: "#",
  },
  {
    img: "/assets/research/Desain tanpa judul.png",
    title: "LOREM IPSUM DOLOR SIT",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    link: "#",
  },
  {
    img: "/assets/research/Desain tanpa judul.png",
    title: "LOREM IPSUM DOLOR SIT",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    link: "#",
  },
  {
    img: "/assets/research/Desain tanpa judul.png",
    title: "LOREM IPSUM DOLOR SIT",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    link: "#",
  },
];

const FEATURED: IdeaItem = {
  img: "/assets/research/Desain tanpa judul.png",
  title: "LOREM IPSUM DOLOR SIT",
  excerpt:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
  link: "#",
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

const IdeasTraditionGridSection: FC = () => {
  const [vw, setVw] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1920
  );

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isNarrow = vw <= 1200;

  const gridTemplateColumns = isNarrow ? "repeat(2, 1fr)" : COLS_DESKTOP;
  const headerMaxWidth = isNarrow ? "100%" : HEADER_MAX_WIDTH_DESKTOP;
  const featuredImgHeight = isNarrow ? "350px" : `calc(${ROW_HEIGHT} * 2 + ${GAP_REM}rem)`;

  return (
    <section id="ideas" aria-labelledby="ideas-title" className="relative mt-50">
      <div
        className="relative mx-auto flex max-w-[1560px] flex-col items-center px-8 py-6"
        style={{ zIndex: 1 }}
      >
        <div
          aria-hidden
          className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-black"
        />

        <div
          className="mb-6 flex w-full items-center justify-between"
          style={{ maxWidth: headerMaxWidth }}
        >
          <h2
            id="ideas-title"
            className="m-0 text-[3rem] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Philosophical Ideas &amp; Tradition
          </h2>

          <a
            href="/IdeasTradition"
            className="inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1rem",
              textDecoration: "none",
            }}
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
          {IDEAS.map((item, i) => {
            const itemStyle: React.CSSProperties = isNarrow ? {} : WIDE_POS[i] ?? {};
            return (
              <article
                key={`${item.title}-${i}`}
                className="relative overflow-hidden rounded-[30px]"
                style={itemStyle}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)",
                  }}
                />
                <div className="absolute bottom-6 left-6 right-6 z-[2] flex flex-col items-start text-left text-white">
                  <h3
                    className="mb-2 text-[1.5rem]"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mb-3 text-[0.9rem] leading-[1.4]"
                    style={{ fontFamily: "'Roboto Condensed', sans-serif", opacity: 0.85 }}
                  >
                    {item.excerpt}
                  </p>
                  <a
                    href={item.link}
                    className="inline-flex items-center text-[0.9rem] underline focus:outline-none focus:ring-2 focus:ring-white/60"
                    style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
                    aria-label={`View: ${item.title}`}
                  >
                    view <span className="ml-[0.3rem]">→</span>
                  </a>
                </div>
              </article>
            );
          })}

          <article
            className="relative flex flex-col justify-end overflow-hidden rounded-[30px]"
            style={
              isNarrow
                ? { gridColumn: "1 / -1" }
                : { gridColumn: "4", gridRow: "1 / span 2", width: "400px" }
            }
          >
            <img
              src={FEATURED.img}
              alt={FEATURED.title}
              className="w-full object-cover"
              style={{ height: featuredImgHeight }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)",
              }}
            />
            <div className="absolute bottom-6 left-6 right-6 z-[2] flex flex-col items-start text-left text-white">
              <h3
                className="mb-2 text-[1.5rem]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {FEATURED.title}
              </h3>
              <p
                className="mb-3 text-[0.9rem] leading-[1.4]"
                style={{ fontFamily: "'Roboto Condensed', sans-serif", opacity: 0.85 }}
              >
                {FEATURED.excerpt}
              </p>
              <a
                href={FEATURED.link}
                className="inline-flex items-center text-[0.9rem] underline focus:outline-none focus:ring-2 focus:ring-white/60"
                style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
                aria-label={`View: ${FEATURED.title}`}
              >
                view <span className="ml-[0.3rem]">→</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default IdeasTraditionGridSection;