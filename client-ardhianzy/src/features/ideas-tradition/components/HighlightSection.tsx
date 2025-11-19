// src/features/ideas-tradition/components/HighlightSection.tsx
import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { contentApi } from "@/lib/content/api";
import type { ArticleDTO } from "@/lib/content/types";
import { ROUTES } from "@/app/routes";

function formatPrettyDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
}

function stripHtml(html?: string | null) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function normalizeMetaText(input?: string | null): string {
  if (!input) return "";
  let s = String(input).trim();
  s = s.replace(/\\u003C/gi, "<").replace(/\\u003E/gi, ">").replace(/\\u0026/gi, "&").replace(/\\"/g, '"');
  s = s.replace(/^\s*"content"\s*:\s*/i, "");
  s = /<[^>]+>/.test(s) ? stripHtml(s) : s;
  return s.replace(/\s+/g, " ").trim();
}

function makePreviewByWords(text: string, maxWords: number) {
  const words = (text ?? "").trim().split(/\s+/).filter(Boolean);
  const truncated = words.length > maxWords;
  const preview = truncated ? words.slice(0, maxWords).join(" ") : words.join(" ");
  return { preview, truncated };
}

function ContinueReadInline() {
  return (
    <span className="ml-2 inline-flex items-center underline underline-offset-4 decoration-white/60 hover:decoration-white">
      Continue to Read&nbsp;→
    </span>
  );
}

type Card = {
  id: string | number;
  title: string;
  image: string;
  slug?: string;
  author: string;
  dateISO?: string;
  desc: string;
};

type Props = {
  articles?: Card[];
  title?: string;
  heroImageUrl?: string;
  initialIndex?: number;
};

export default function HighlightSection({
  articles,
  title = "IDEAS & TRADITION",
  heroImageUrl = "/assets/ideas&tradition/Groupkdfk.png",
  initialIndex = 0,
}: Props) {
  const [remote, setRemote] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        if (articles?.length) {
          setRemote(articles);
          return;
        }

        const list = await contentApi.articles.list();
        if (!alive) return;

        const ideas = (list ?? []).filter((a: ArticleDTO) => {
          const c = (a.category ?? "").toUpperCase();
          return c === "IDEAS_AND_TRADITIONS" || c === "IDEAS_AND_TRADITION";
        });

        const mapped: Card[] = ideas.map((a: ArticleDTO) => {
          const desc =
            normalizeMetaText(a.meta_description) ||
            (a.excerpt ?? "").trim() ||
            stripHtml(a.content);

          return {
            id: a.id,
            title: a.title ?? "Untitled",
            image: a.image ?? "",
            slug: a.slug,
            author: "Ardhianzy",
            dateISO: a.date || a.created_at || undefined,
            desc,
          };
        });

        const sortedDesc = mapped.slice().sort((a, b) => {
          const ta = new Date(a.dateISO ?? "").getTime();
          const tb = new Date(b.dateISO ?? "").getTime();
          return (tb || 0) - (ta || 0);
        });

        const latest = sortedDesc[0];

        setRemote(
          latest
            ? [latest]
            : [
                {
                  id: "ideas-coming-soon",
                  title: "NEXT: COMING SOON",
                  image: "/assets/icon/Ardhianzy_Logo_2.png",
                  // slug: undefined,
                  author: "Ardhianzy",
                  dateISO: undefined,
                  desc: "SOON",
                },
              ]
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [articles]);

  const items: Card[] = articles?.length ? articles : remote;

  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0))
  );
  useEffect(() => {
    setCurrentIndex((prev) => (items.length ? Math.min(prev, items.length - 1) : 0));
  }, [items.length]);

  const sliderVars: CSSProperties = { ["--current-index" as any]: currentIndex };

  const LEDE =
    "Kumpulan artikel dan tulisan mendalam yang membedah ide-ide filosofis besar dalam sejarah dan tradisi intelektual manusia. Mulai dari metafisika Yunani kuno, pemikiran skolastik, pencerahan modern, hingga kritik post-strukturalis. Halaman ini adalah pusat gravitasi filosofis dari Ardhianzy, tempat di mana teori besar diuji dalam percakapan zaman.";

  const isNavDisabled = items.length <= 1;

  const goPrev = () => { if (!isNavDisabled) setCurrentIndex((p) => (p === 0 ? items.length - 1 : p - 1)); };
  const goNext = () => { if (!isNavDisabled) setCurrentIndex((p) => (p === items.length - 1 ? 0 : p + 1)); };

  return (
    <div className="it-highlight-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;300&display=swap');

        .it__bebas { font-family: 'Bebas Neue', cursive !important; }
        .it__roboto { font-family: 'Roboto', sans-serif !important; }
        .it__heroTitle { font-size: 5rem !important; }

        .it-head__dekWrap{
          position: absolute !important;
          z-index: 2 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          bottom: clamp(18px, 6vh, 0px) !important;
          width: min(150ch, 100vw) !important;
          max-width: min(250ch, 100vw) !important;
          pointer-events: none !important;
          text-align: center !important;
        }
        .it-head__dek{
          position: relative !important;
          pointer-events: auto !important;
          margin: 0 auto !important;
          width: 100% !important;
          font-family: Roboto, ui-sans-serif, system-ui !important;
          font-size: clamp(0.95rem, 1.2vw, 1.05rem) !important;
          line-height: 1.7 !important;
          color: #ECECEC !important;
          text-align: center !important;
          letter-spacing: .1px !important;

          border-top: 2px solid rgba(255,255,255,.22) !important;
          border-left: 0 !important;
          border-right: 0 !important;

          padding: 0.85rem 1.15rem !important;
          background: linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.28)) !important;
          backdrop-filter: blur(2px);
          border-radius: 0px !important;
          box-shadow: 0 12px 30px rgba(0,0,0,.18);
        }

        .it-head__section::before {
          content: "" !important;
          position: absolute !important;
          inset: 0 !important;
          background-image: url('/assets/magazine/highlightMagazine.png') !important;
          background-position: start !important;
          background-repeat: no-repeat !important;
          background-size: cover !important;
          pointer-events: none !important;
          z-index: 0 !important;
        }

        .ith__nav{
          position:absolute !important; top:50% !important; transform:translateY(-50%) !important; z-index:10 !important;
          display:flex !important; align-items:center !important; justify-content:center !important;
          width:60px !important; height:60px !important; border-radius:9999px !important;
          border:2px solid rgba(255,255,255,0.3) !important; background:rgba(255,255,255,0.1) !important;
          color:#ffffff !important; font-size:1.5rem !important; line-height:1 !important;
          transition:transform .2s ease, background-color .2s ease, opacity .2s ease, filter .2s ease !important;
        }
        .ith__nav:hover{ transform:translateY(-50%) scale(1.10) !important; background:rgba(255,255,255,0.2) !important; }
        .ith__nav--left{ left:40px !important; }
        .ith__nav--right{ right:40px !important; }
        .ith__nav[disabled],
        .ith__nav[aria-disabled="true"]{
          opacity:.4 !important; cursor:not-allowed !important; filter:grayscale(40%) !important;
        }

        .it-slider {
          --card-w: 1029px;
          --card-gap: 30px;
          transform: translateX(
            calc(50% - (var(--card-w) / 2) - (var(--current-index) * (var(--card-w) + var(--card-gap))))
          ) !important;
        }
        @media (max-width: 1200px) {
          .it-slider { --card-w: 90vw; --card-gap: 20px; }
        }
        @media (max-width: 768px) {
          .it-slider { --card-w: 95vw; --card-gap: 15px; }
          .ith__nav{ width:45px !important; height:45px !important; font-size:1.2rem !important; }
          .ith__nav--left{ left:0.5rem !important; }
          .ith__nav--right{ right:0.5rem !important; }
        }

        .it-desc {
          font-size: 1rem !important;
          line-height: 1.5 !important;
          opacity: 0.9 !important;
          max-width: 450px !important;
          display: -webkit-box !important;
          -webkit-line-clamp: 7 !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }
      `}</style>

      <section
        aria-label="Ideas highlight hero"
        className="relative w-screen h-[60vh] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-black bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('${heroImageUrl}')`,
          backgroundPosition: "start",
          height: "58vh",
          filter: "grayscale(100%)",
          mixBlendMode: "luminosity",
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, transparent 100%)" }}
        />
        <h1 className="it__bebas it__heroTitle relative z-[2] uppercase text-center text-white pb-20">
          {title}
        </h1>

        <div className="it-head__dekWrap">
          <p className="it-head__dek">{LEDE}</p>
        </div>
      </section>

      <section className="it-head__section relative w-full py-5 bg-black overflow-hidden mt-8">
        <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
          <button
            type="button"
            aria-label="Previous article"
            onClick={goPrev}
            disabled={isNavDisabled}
            aria-disabled={isNavDisabled}
            className="ith__nav ith__nav--left"
          >
            &#8249;
          </button>

          <div className="relative h-[417px] w-full overflow-visible">
            <div
              className="it-slider flex h-full items-center gap-[30px] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={sliderVars}
            >
              {(items.length ? items : loading ? [{ id: "skeleton", title: "", image: "", author: "Ardhianzy", desc: "" }] : []).map(
                (article: any, idx: number) => {
                  const isActive = idx === currentIndex;

                  const { preview, truncated } = makePreviewByWords(article.desc ?? "", 45);
                  const dateHuman = formatPrettyDate(article.dateISO);

                  const isComingSoon = article.id === "ideas-coming-soon";
                  // const href = article.slug
                  //   ? ROUTES.IDEAS_TRADITION_DETAIL.replace(":slug", article.slug)
                  //   : ROUTES.IDEAS_TRADITION; // (disable navigasi coming-soon)

                  const CardInner = (
                    <>
                      <img
                        src={article.image}
                        alt={article.title}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition-[filter] duration-300 filter grayscale hover:grayscale-0"
                      />

                      <div
                        className="absolute inset-0 flex flex-col items-start justify-start p-[30px] pr-[40px] text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
                        }}
                      >
                        <h3 className="it__bebas uppercase !text-[3.5rem] !font-normal !leading-[1] tracking-[2px] max-w-[500px] mb-[10px]">
                          {article.title}
                        </h3>

                        {(article.author || dateHuman) ? (
                          <p className="it__roboto mb-[12px] !text-[0.95rem] leading-[1.4] opacity-80">
                            {article.author ?? "Ardhianzy"}
                            {article.author && dateHuman ? " • " : ""}
                            {dateHuman ?? ""}
                          </p>
                        ) : null}

                        <p className="it__roboto it-desc">
                          {preview}
                          {truncated && (
                            <>
                              {"…"} <ContinueReadInline />
                            </>
                          )}
                        </p>
                      </div>
                    </>
                  );

                  return isComingSoon ? (
                    <article
                      key={article.id}
                      className={[
                        "relative shrink-0 cursor-default overflow-hidden bg-[#111] transition-all duration-300",
                        "!w-[1029px] !h-[417px]",
                        "max-[1200px]:!w-[90vw] max-[1200px]:!h-[350px]",
                        "max-[768px]:!w-[95vw] max-[768px]:!h-[300px]",
                        isActive ? "!opacity-100 !scale-100" : "!opacity-50 !scale-95",
                      ].join(" ")}
                      aria-label={article.title}
                    >
                      {CardInner}
                    </article>
                  ) : (
                    <Link
                      key={article.id}
                      to={article.slug ? ROUTES.IDEAS_TRADITION_DETAIL.replace(":slug", article.slug) : ROUTES.IDEAS_TRADITION}
                      className={[
                        "relative shrink-0 cursor-pointer overflow-hidden bg-[#111] transition-all duration-300",
                        "!w-[1029px] !h-[417px]",
                        "max-[1200px]:!w-[90vw] max-[1200px]:!h-[350px]",
                        "max-[768px]:!w-[95vw] max-[768px]:!h-[300px]",
                        isActive ? "!opacity-100 !scale-100" : "!opacity-50 !scale-95",
                        "hover:!scale-[1.02] hover:!opacity-100 hover:!shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
                      ].join(" ")}
                      style={{ textDecoration: "none" }}
                      aria-label={article.title}
                    >
                      {CardInner}
                    </Link>
                  );
                }
              )}
            </div>
          </div>

          <button
            type="button"
            aria-label="Next article"
            onClick={goNext}
            disabled={isNavDisabled}
            aria-disabled={isNavDisabled}
            className="ith__nav ith__nav--right"
          >
            &#8250;
          </button>
        </div>
      </section>
    </div>
  );
}