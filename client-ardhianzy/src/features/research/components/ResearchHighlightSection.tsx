// src/features/research/components/ResearchHighlightSection.tsx
import { useState, useEffect, type CSSProperties } from "react";
import { contentApi } from "@/lib/content/api";
import type { ResearchDTO } from "@/lib/content/types";
import { Link } from "react-router-dom";

export type ResearchHighlightArticle = {
  id: number | string;
  title: string;
  description: string;
  image: string;
  researcher?: string;
  dateISO?: string;
  slug?: string;
};

type Props = {
  articles?: ResearchHighlightArticle[];
  headingTitle?: string;
  headingBackgroundUrl?: string;
  initialIndex?: number;
};

function truncateByPhraseOrWords(text: string, phrase: string, maxWords: number) {
  const safe = (text ?? "").trim();
  if (!safe) return "";
  const idx = safe.toLowerCase().indexOf(phrase.toLowerCase());
  if (idx !== -1) return safe.slice(0, idx + phrase.length).trim().replace(/\s+$/, "");
  const words = safe.split(/\s+/);
  if (words.length <= maxWords) return safe;
  const cut = words.slice(0, maxWords).join(" ");
  return cut.replace(/[,\.;:!?\-—]+$/, "");
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
}

export default function ResearchHighlightSection({
  articles,
  headingTitle = "RESEARCH",
  headingBackgroundUrl = "/assets/Group 4981.svg",
  initialIndex = 2,
}: Props) {
  const [remote, setRemote] = useState<ResearchHighlightArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    if (articles && articles.length) {
      setRemote(articles);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const list = await contentApi.research.list();
        if (!alive) return;
        const mapped: ResearchHighlightArticle[] = (list ?? []).map((r: ResearchDTO) => ({
          id: r.id,
          title: r.research_title,
          description: r.research_sum,
          image: r.image ?? "",
          researcher: r.researcher,
          dateISO: r.research_date || r.pdf_uploaded_at || r.created_at || undefined,
          slug: r.slug,
        }));
        setRemote(mapped);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [articles]);

  const items = articles && articles.length > 0 ? articles : remote;

  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0))
  );
  useEffect(() => {
    setCurrentIndex((prev) => (items.length ? Math.min(prev, items.length - 1) : 0));
  }, [items.length]);

  const sliderVars: CSSProperties = { ["--current-index" as any]: currentIndex };

  const isNavDisabled = items.length <= 1;
  const goPrev = () => {
    if (isNavDisabled) return;
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };
  const goNext = () => {
    if (isNavDisabled) return;
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <section
        className="relative flex h-[60vh] w-screen items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('${headingBackgroundUrl}')`,
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
        }}
      >
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, transparent 100%)",
          }}
        />
        <h1 className="relative z-[2] font-bebas uppercase text-white text-center !text-[5rem]">
          {headingTitle}
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

        <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
          <button
            type="button"
            aria-label="Previous article"
            onClick={goPrev}
            disabled={isNavDisabled}
            aria-disabled={isNavDisabled}
            className={[
              "absolute left-10 z-10 flex h-[60px] w-[60px] items-center justify-center !rounded-full border-2 border-white/30 bg-white/10 text-white text-[1.5rem] transition-all",
              "!hover:scale-110 !hover:bg-white/20",
              "max-[768px]:left-2 max-[768px]:h-[45px] max-[768px]:w-[45px] max-[768px]:text-[1.2rem]",
              isNavDisabled ? "opacity-40 cursor-not-allowed" : "",
            ].join(" ")}
          >
            &#8249;
          </button>

          <div className="relative h-[417px] w-full overflow-visible">
            <div
              className="rs-article-slider flex h-full items-center gap-[30px] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={sliderVars}
            >
              {(items.length ? items : loading ? [{ id: "skeleton", title: "", description: "", image: "" }] : []).map(
                (article, idx) => {
                  const isActive = idx === currentIndex;

                  const descPreview = truncateByPhraseOrWords(
                    article.description ?? "",
                    "sebagai penulis",
                    50
                  );
                  const showEllipsis =
                    (article.description ?? "").trim().length > (descPreview ?? "").trim().length;
                  const dateHuman = formatDate(article.dateISO);

                  return (
                    <Link
                      key={article.id}
                      to={article.slug ? `/research/${article.slug}` : "/research"}
                      className="block shrink-0"
                      style={{ textDecoration: "none" }}
                      aria-label={article.title}
                    >
                      <article
                        key={article.id}
                        className={[
                          "relative shrink-0 cursor-pointer overflow-hidden bg-[#111] transition-all duration-300",
                          "!w-[1029px] !h-[417px]",
                          "max-[1200px]:!w-[90vw] max-[1200px]:!h-[350px]",
                          "max-[768px]:!w-[95vw] max-[768px]:!h-[300px]",
                          isActive ? "!opacity-100 !scale-100" : "!opacity-50 !scale-95",
                          "hover:!scale-[1.02] hover:!opacity-100 hover:!shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
                        ].join(" ")}
                      >
                        <img
                          src={article.image}
                          alt={article.title}
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
                          <h3 className="font-bebas uppercase !text-[3.5rem] leading-[1] tracking-[2px] max-w-[500px] mb-[10px]">
                            {article.title}
                          </h3>

                          {(article.researcher || dateHuman) ? (
                            <p className="mb-[12px] font-semibold text[1.1rem] text-[#aaa]">
                              {article.researcher ?? ""}
                              {article.researcher && dateHuman ? " • " : ""}
                              {dateHuman ?? ""}
                            </p>
                          ) : null}

                          <p className="font-roboto text-left !text-[1rem] leading-[1.6] opacity-90 max-w-[450px]">
                            {descPreview}
                            {showEllipsis ? "..." : ""} <span
                              className="
                                ml-2 inline-flex items-center underline underline-offset-4
                                decoration-white/60 hover:decoration-white
                              "
                            >
                              Continue Read&nbsp;→
                            </span>
                          </p>
                        </div>
                      </article>
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
            className={[
              "absolute right-10 z-10 flex h-[60px] w-[60px] items-center justify-center !rounded-full border-2 border-white/30 bg-white/10 text-white text-[1.5rem] transition-all",
              "!hover:scale-110 !hover:bg-white/20",
              "max-[768px]:right-2 max-[768px]:h-[45px] max-[768px]:w-[45px] max-[768px]:text-[1.2rem]",
              isNavDisabled ? "opacity-40 cursor-not-allowed" : "",
            ].join(" ")}
          >
            &#8250;
          </button>
        </div>
      </section>

      <style>{`
        .rs-article-slider {
          --card-w: 1029px;
          --card-gap: 30px;
          transform: translateX(
            calc(50% - (var(--card-w) / 2) - (var(--current-index) * (var(--card-w) + var(--card-gap))))
          ) !important;
        }
        @media (max-width: 1200px) {
          .rs-article-slider {
            --card-w: 90vw;
            --card-gap: 20px;
          }
        }
        @media (max-width: 768px) {
          .rs-article-slider {
            --card-w: 95vw;
            --card-gap: 15px;
          }
        }
      `}</style>
    </>
  );
}