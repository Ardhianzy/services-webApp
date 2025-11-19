// src/features/pop-cultures/components/PopCultureReviewHighlightSection.tsx
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

export default function PopCultureReviewHighlightSection({
  articles,
  title = "POPSOPHIA",
  heroImageUrl = "/assets/popCulture/dadasdfe.png",
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
        const list = await contentApi.articles.list({ category: "POP_CULTURE" });

        if (!alive) return;

        const mapped: Card[] = (list ?? []).map((a: ArticleDTO) => {
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
                  id: "pcr-coming-soon",
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
    return () => {
      alive = false;
    };
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
    "Di sinilah filsafat bertemu dengan budaya populer. Rubrik ini mengeksplorasi film, anime, musik, dan media kontemporer lainnya—bukan sebagai hiburan semata, melainkan sebagai ruang simbolik yang mencerminkan nilai, krisis, dan mitologi dunia modern. PCR adalah jembatan antara kedalaman dan arus, antara refleksi dan fenomena.";

  return (
    <div className="pc-review-highlight-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;300&display=swap');

        .pc__bebas { font-family: 'Bebas Neue', cursive !important; }
        .pc__roboto { font-family: 'Roboto', sans-serif !important; }
        .pc__heroTitle { font-size: 5rem !important; }

        .pcr-head__dekWrap{
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
        .pcr-head__dek{
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

        .pcr-head__section::before {
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

        .pcr-desc {
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

        .pcr__nav{
          position:absolute !important; top:50% !important; transform:translateY(-50%) !important; z-index:10 !important;
          display:flex !important; align-items:center !important; justify-content:center !important;
          width:60px !important; height:60px !important; border-radius:9999px !important;
          border:2px solid rgba(255,255,255,0.3) !important; background:rgba(255,255,255,0.1) !important;
          color:#ffffff !important; font-size:1.5rem !important; line-height:1 !important;
          transition:transform .2s ease, background-color .2s ease, opacity .2s ease, filter .2s ease !important;
        }
        .pcr__nav:hover{ transform:translateY(-50%) scale(1.10) !important; background:rgba(255,255,255,0.2) !important; }
        .pcr__nav--left{ left:40px !important; }
        .pcr__nav--right{ right:40px !important; }
        .pcr__nav[disabled],
        .pcr__nav[aria-disabled="true"]{
          opacity:.4 !important; cursor:not-allowed !important; filter:grayscale(40%) !important;
        }

        .pc-review-slider {
          --card-w: 1029px;
          --card-gap: 30px;
          transform: translateX(
            calc(50% - (var(--card-w) / 2) - (var(--current-index) * (var(--card-w) + var(--card-gap))))
          ) !important;
        }
        @media (max-width: 1200px) {
          .pc-review-slider { --card-w: 90vw; --card-gap: 20px; }
        }
        @media (max-width: 768px) {
          .pc-review-slider { --card-w: 95vw; --card-gap: 15px; }
          .pcr__nav{ width:45px !important; height:45px !important; font-size:1.2rem !important; }
          .pcr__nav--left{ left:0.5rem !important; }
          .pcr__nav--right{ right:0.5rem !important; }
        }
      `}</style>

      <section
        aria-label="Pop-culture highlight hero"
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
        <h1 className="pc__bebas pc__heroTitle relative z-[2] uppercase text-center text-white pb-20">
          {title}
        </h1>

        <div className="pcr-head__dekWrap">
          <p className="pcr-head__dek">{LEDE}</p>
        </div>
      </section>

      <section className="pcr-head__section relative w-full py-5 bg-black overflow-hidden mt-8">
        <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
          <div className="relative h-[417px] w-full overflow-visible">
            <div
              className="pc-review-slider flex h-full items-center gap-[30px] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={sliderVars}
            >
              {(items.length ? items : loading ? [{ id: "skeleton", title: "", image: "", author: "Ardhianzy", desc: "" }] : []).map(
                (article: any, idx: number) => {
                  const isActive = idx === currentIndex;

                  const { preview, truncated } = makePreviewByWords(article.desc ?? "", 45);
                  const dateHuman = formatPrettyDate(article.dateISO);

                  const isComingSoon = article.id === "pcr-coming-soon";

                  // const href = article.slug
                  //   ? ROUTES.POP_CULTURE_REVIEW_DETAIL.replace(":slug", article.slug)
                  //   : ROUTES.POP_CULTURE_REVIEW;

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
                        <h3 className="pc__bebas uppercase !text-[3.5rem] !font-normal !leading-[1] tracking-[2px] max-w-[500px] mb-[10px]">
                          {article.title}
                        </h3>

                        {(article.author || dateHuman) ? (
                          <p className="pc__roboto mb-[12px] !text-[0.95rem] leading-[1.4] opacity-80">
                            {article.author ?? "Ardhianzy"}
                            {article.author && dateHuman ? " • " : ""}
                            {dateHuman ?? ""}
                          </p>
                        ) : null}

                        <p className="pc__roboto pcr-desc text-left">
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
                      to={article.slug ? ROUTES.POP_CULTURE_REVIEW_DETAIL.replace(":slug", article.slug) : ROUTES.POP_CULTURE_REVIEW}
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
        </div>
      </section>
    </div>
  );
}