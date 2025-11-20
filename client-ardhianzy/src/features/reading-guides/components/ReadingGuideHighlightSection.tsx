// src/features/reading-guides/components/ReadingGuideHighlightSection.tsx
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

function normalizeBackendHtml(payload?: string | null): string {
  if (!payload) return "";
  let s = (payload ?? "").trim();
  s = s
    .replace(/\\u003C/gi, "<")
    .replace(/\\u003E/gi, ">")
    .replace(/\\u0026/gi, "&")
    .replace(/\\"/g, '"');
  s = s.replace(/^\s*"?content"?\s*:\s*"?/i, "");
  s = s.replace(/"\s*$/, "");
  s = s.replace(/<p>\s*<\/p>/g, "");
  const firstTag = s.indexOf("<");
  if (firstTag > 0) s = s.slice(firstTag);
  if (!/<[a-z][\s\S]*>/i.test(s)) s = s ? `<p>${s}</p>` : "";
  return s.trim();
}
function stripHtml(html?: string | null) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
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
  guides?: Card[];
  title?: string;
  heroImageUrl?: string;
  initialIndex?: number;
};

export default function ReadingGuideHighlightSection({
  guides,
  title = "READING GUIDE",
  heroImageUrl = "/assets/readingGuide/belajar2.png",
  initialIndex = 0,
}: Props) {
  const [remote, setRemote] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        if (guides?.length) {
          setRemote(guides);
          return;
        }

        const list = await contentApi.articles.list();
        if (!alive) return;

        const filtered = (list ?? []).filter(
          (a: ArticleDTO) => (a.category ?? "").toUpperCase() === "READING_GUIDLINE"
        );

        const mapped: Card[] = filtered.map((a: ArticleDTO) => {
          const html =
            normalizeBackendHtml(a.meta_description) ||
            normalizeBackendHtml(a.excerpt) ||
            normalizeBackendHtml(a.content);
          return {
            id: a.id,
            title: a.title ?? "Untitled",
            image: a.image ?? "",
            slug: a.slug,
            author: "Ardhianzy",
            dateISO: a.date || a.created_at || undefined,
            desc: stripHtml(html),
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
                  id: "rg-coming-soon",
                  title: "NEXT: COMING SOON",
                  image: "/assets/icon/Ardhianzy_Logo_2.png",
                  // slug: undefined,
                  author: "Ardhianzy",
                  dateISO: undefined,
                  desc: "Reading Guide in Progress",
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
  }, [guides]);

  const items: Card[] = guides?.length ? guides : remote;

  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0))
  );
  useEffect(() => {
    setCurrentIndex((prev) => (items.length ? Math.min(prev, items.length - 1) : 0));
  }, [items.length]);

  const sliderVars: CSSProperties = { ["--current-index" as any]: currentIndex };

  const LEDE =
    "Panduan membaca karya-karya filsuf secara langsung dan kritis. Bukan daftar bacaan, melainkan cara membaca: bagaimana mendekati teks Plato, memahami gaya penulisan Nietzsche, menafsirkan fenomenologi Husserl, atau mengikuti struktur argumentatif Kant. Halaman ini membantu pembaca memahami bukan hanya apa yang dikatakan filsuf, tapi bagaimana cara mereka mengatakan dan memikirkan sesuatu. Tujuannya adalah membentuk pembaca yang reflektif, bukan sekadar informatif.";

  return (
    <div className="rg-highlight-wrapper text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;300&display=swap');

        .rg__bebas { font-family: 'Bebas Neue', cursive !important; }
        .rg__roboto { font-family: 'Roboto', sans-serif !important; }
        .rg__heroTitle { font-size: 5rem !important; }

        .rg-head__dekWrap{
          position: absolute !important;
          z-index: 2 !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          bottom: clamp(18px, 6vh, 0px) !important;
          width: min(160ch, 110vw) !important;
          max-width: min(250ch, 100vw) !important;
          pointer-events: none !important;
          text-align: center !important;
        }
        .rg-head__dek{
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

        .rg-head__section::before {
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

        .rg-desc {
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

        .rg-slider {
          --card-w: 1029px;
          --card-gap: 30px;
          transform: translateX(
            calc(50% - (var(--card-w) / 2) - (var(--current-index) * (var(--card-w) + var(--card-gap))))
          ) !important;
        }
        @media (max-width: 1200px) {
          .rg-slider { --card-w: 90vw; --card-gap: 20px; }
        }
        @media (max-width: 768px) {
          .rg-slider { --card-w: 95vw; --card-gap: 15px; }
        }
      `}</style>

      <section
        aria-label="Reading guide highlight hero"
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
        <h1 className="rg__bebas rg__heroTitle relative z-[2] uppercase text-center text-white pb-20">
          {title}
        </h1>

        <div className="rg-head__dekWrap">
          <p className="rg-head__dek">{LEDE}</p>
        </div>
      </section>

      <section className="rg-head__section relative w-full py-5 bg-black overflow-hidden mt-8">
        <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
          <div className="relative h-[417px] w-full overflow-visible">
            <div
              className="rg-slider flex h-full items-center gap-[30px] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={sliderVars}
            >
              {(items.length ? items : loading ? [{ id: "skeleton", title: "", image: "", author: "Ardhianzy", desc: "" }] : []).map(
                (g: any, idx: number) => {
                  const isActive = idx === currentIndex;

                  const { preview, truncated } = makePreviewByWords(g.desc ?? "", 45);
                  const dateHuman = formatPrettyDate(g.dateISO);

                  const isComingSoon = g.id === "rg-coming-soon";

                  // const href = g.slug
                  //   ? ROUTES.READING_GUIDE_DETAIL.replace(":slug", g.slug)
                  //   : ROUTES.READING_GUIDE_COMING_SOON;

                  const ArticleInner = (
                    <>
                      <img
                        src={g.image}
                        alt={g.title}
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
                        <h3 className="rg__bebas uppercase !text-[3.5rem] !font-normal !leading-[1] tracking-[2px] max-w-[500px] mb-[10px]">
                          {g.title}
                        </h3>

                        {(g.author || dateHuman) ? (
                          <p className="rg__roboto mb-[12px] !text-[0.95rem] leading-[1.4] opacity-80">
                            {g.author ?? "Ardhianzy"}
                            {g.author && dateHuman ? " • " : ""}
                            {dateHuman ?? ""}
                          </p>
                        ) : null}

                        <p className="rg-desc">
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
                      key={g.id}
                      className={[
                        "relative shrink-0 cursor-default overflow-hidden bg-[#111] transition-all duration-300",
                        "!w-[1029px] !h-[417px]",
                        "max-[1200px]:!w-[90vw] max-[1200px]:!h-[350px]",
                        "max-[768px]:!w-[95vw] max-[768px]:!h-[300px]",
                        isActive ? "!opacity-100 !scale-100" : "!opacity-50 !scale-95",
                      ].join(" ")}
                      aria-label={g.title}
                    >
                      {ArticleInner}
                    </article>
                  ) : (
                    <Link
                      key={g.id}
                      to={g.slug ? ROUTES.READING_GUIDE_DETAIL.replace(":slug", g.slug) : ROUTES.READING_GUIDE}
                      className={[
                        "relative shrink-0 cursor-pointer overflow-hidden bg-[#111] transition-all duration-300",
                        "!w-[1029px] !h-[417px]",
                        "max-[1200px]:!w-[90vw] max-[1200px]:!h-[350px]",
                        "max-[768px]:!w-[95vw] max-[768px]:!h-[300px]",
                        isActive ? "!opacity-100 !scale-100" : "!opacity-50 !scale-95",
                        "hover:!scale-[1.02] hover:!opacity-100 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
                      ].join(" ")}
                      style={{ textDecoration: "none" }}
                      aria-label={g.title}
                    >
                      {ArticleInner}
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