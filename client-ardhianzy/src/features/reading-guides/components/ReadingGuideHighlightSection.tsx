// src/features/reading-guide/components/ReadingGuideHighlightSection.tsx
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

function truncateWords(text: string, maxWords: number) {
  const words = (text ?? "").trim().split(/\s+/);
  if (words.length <= maxWords) return text ?? "";
  return words.slice(0, maxWords).join(" ").replace(/[,\.;:!?\-—]+$/, "");
}

function ContinueReadInline() {
  return (
    <span className="ml-2 inline-flex items-center underline underline-offset-4 decoration-white/60 hover:decoration-white">
      Continue Read&nbsp;→
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
  descriptionMaxWords?: number;
};

export default function ReadingGuideHighlightSection({
  guides,
  title = "READING GUIDE",
  heroImageUrl = "/assets/readingGuide/belajar2.png",
  initialIndex = 0,
  descriptionMaxWords = 40,
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
        const filtered = (list ?? []).filter((a: ArticleDTO) => (a.category ?? "").toUpperCase() === "READING_GUIDE");
        const mapped: Card[] = filtered.map((a: ArticleDTO) => {
          const html =
            normalizeBackendHtml(a.meta_description) ||
            normalizeBackendHtml(a.excerpt) ||
            normalizeBackendHtml(a.content);
          const desc = stripHtml(html);
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
        setRemote(
          mapped.length
            ? mapped
            : [{
                id: "rg-coming-soon",
                title: "NEXT: COMING SOON",
                image: "/assets/research/Desain tanpa judul.png",
                slug: undefined,
                author: "Ardhianzy",
                dateISO: undefined,
                desc: "SOON",
              }]
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [guides]);

  const items: Card[] = guides?.length ? guides : remote;

  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0))
  );
  useEffect(() => {
    setCurrentIndex((prev) => (items.length ? Math.min(prev, items.length - 1) : 0));
  }, [items.length]);

  const sliderVars: CSSProperties = { ["--current-index" as any]: currentIndex };
  const isNavDisabled = items.length <= 1;

  const goPrev = () => { if (!isNavDisabled) setCurrentIndex((p) => (p === 0 ? items.length - 1 : p - 1)); };
  const goNext = () => { if (!isNavDisabled) setCurrentIndex((p) => (p === items.length - 1 ? 0 : p + 1)); };

  return (
    <div className="rg-highlight-wrapper text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;300&display=swap');

        .rg__bebas { font-family: 'Bebas Neue', cursive !important; }
        .rg__roboto { font-family: 'Roboto', sans-serif !important; }
        .rg__heroTitle { font-size: 5rem !important; }

        .rgh__nav{
          position:absolute !important; top:50% !important; transform:translateY(-50%) !important; z-index:10 !important;
          display:flex !important; align-items:center !important; justify-content:center !important;
          width:60px !important; height:60px !important; border-radius:9999px !important;
          border:2px solid rgba(255,255,255,0.3) !important; background:rgba(255,255,255,0.1) !important;
          color:#ffffff !important; font-size:1.5rem !important; line-height:1 !important;
          transition:transform .2s ease, background-color .2s ease, opacity .2s ease, filter .2s ease !important;
        }
        .rgh__nav:hover{ transform:translateY(-50%) scale(1.10) !important; background:rgba(255,255,255,0.2) !important; }
        .rgh__nav--left{ left:40px !important; }
        .rgh__nav--right{ right:40px !important; }
        .rgh__nav[disabled],
        .rgh__nav[aria-disabled="true"]{
          opacity:.4 !important; cursor:not-allowed !important; filter:grayscale(40%) !important;
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
          .rgh__nav{ width:45px !important; height:45px !important; font-size:1.2rem !important; }
          .rgh__nav--left{ left:0.5rem !important; }
          .rgh__nav--right{ right:0.5rem !important; }
        }
      `}</style>

      <section
        aria-label="Reading guide highlight hero"
        className="relative w-screen h-[60vh] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-black bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('${heroImageUrl}')`, filter: "grayscale(100%)", mixBlendMode: "luminosity" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, transparent 100%)" }}
        />
        <h1 className="rg__bebas rg__heroTitle relative z-[2] uppercase text-center text-white">
          {title}
        </h1>
      </section>

      <section className="relative w-full py-5 bg-black overflow-hidden mt-38">
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-[3]"
          style={{ width: "15%", maxWidth: 200, background: "linear-gradient(to right, #000 30%, transparent 100%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-[3]"
          style={{ width: "15%", maxWidth: 200, background: "linear-gradient(to left, #000 30%, transparent 100%)" }}
        />

        <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
          <button
            type="button"
            aria-label="Previous guide"
            onClick={goPrev}
            disabled={isNavDisabled}
            aria-disabled={isNavDisabled}
            className="rgh__nav rgh__nav--left"
          >
            &#8249;
          </button>

          <div className="relative h-[417px] w-full overflow-visible">
            <div
              className="rg-slider flex h-full items-center gap-[30px] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={sliderVars}
            >
              {(items.length ? items : loading ? [{ id: "skeleton", title: "", image: "", author: "Ardhianzy", desc: "" }] : []).map(
                (g: any, idx: number) => {
                  const isActive = idx === currentIndex;
                  const preview = truncateWords(g.desc ?? "", descriptionMaxWords);
                  const showDots = (g.desc ?? "").trim().length > preview.trim().length;
                  const dateHuman = formatPrettyDate(g.dateISO);

                  const href = g.slug
                    ? ROUTES.READING_GUIDE_DETAIL.replace(":slug", g.slug)
                    : ROUTES.READING_GUIDE_COMING_SOON;

                  return (
                    <Link
                      key={g.id}
                      to={href}
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
                      <img
                        src={g.image}
                        alt={g.title}
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

                        <p className="rg__roboto text-left !text-[1rem] leading-[1.6] opacity-90 max-w-[450px]">
                          {preview}
                          {showDots ? "..." : ""} <ContinueReadInline />
                        </p>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          </div>

          <button
            type="button"
            aria-label="Next guide"
            onClick={goNext}
            disabled={isNavDisabled}
            aria-disabled={isNavDisabled}
            className="rgh__nav rgh__nav--right"
          >
            &#8250;
          </button>
        </div>
      </section>
    </div>
  );
}