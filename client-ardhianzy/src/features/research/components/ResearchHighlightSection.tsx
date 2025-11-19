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

function normalizeBackendHtml(payload?: string | null): string {
  if (!payload) return "";
  let s = String(payload).trim();
  s = s.replace(/\\u003C/gi, "<").replace(/\\u003E/gi, ">").replace(/\\u0026/gi, "&");
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) s = s.slice(1, -1);
  return s;
}
function sanitizeBasicHtml(html: string): string {
  let out = html;
  out = out.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*"(?:[^"]*)"/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*'(?:[^']*)'/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*[^>\s]+/gi, "");
  out = out.replace(/(href|src)\s*=\s*"(?:\s*javascript:[^"]*)"/gi, '$1="#"');
  out = out.replace(/(href|src)\s*=\s*'(?:\s*javascript:[^']*)'/gi, '$1="#"');
  return out;
}
function htmlToPlainText(html?: string): string {
  const s = sanitizeBasicHtml(normalizeBackendHtml(html || ""));
  return s
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*p\s*>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makePreviewByWords(text: string, maxWords: number) {
  const words = (text ?? "").split(/\s+/).filter(Boolean);
  const truncated = words.length > maxWords;
  const preview = truncated ? words.slice(0, maxWords).join(" ") : words.join(" ");
  return { preview, truncated };
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
}

/* ===== Inline CTA ===== */
function ContinueReadInline() {
  return (
    <span
      className="
        ml-2 inline-flex items-center underline underline-offset-4
        decoration-white/60 hover:decoration-white
      "
    >
      Continue to Read&nbsp;→
    </span>
  );
}

export default function ResearchHighlightSection({
  articles,
  headingTitle = "RESEARCH",
  headingBackgroundUrl = "/assets/Group 4981.svg",
  initialIndex = 0,
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

        const sorted = (list ?? []).slice().sort((a, b) => {
          const ta = new Date((a.research_date || a.pdf_uploaded_at || a.created_at || "") as string).getTime();
          const tb = new Date((b.research_date || b.pdf_uploaded_at || b.created_at || "") as string).getTime();
          return (tb || 0) - (ta || 0);
        });

        const mapped: ResearchHighlightArticle[] = sorted.map((r: ResearchDTO) => ({
          id: r.id,
          title: r.research_title,
          description: r.research_sum ?? "",
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

  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    setCurrentIndex(items.length ? Math.min(Math.max(initialIndex, 0), items.length - 1) : 0);
  }, [items.length, initialIndex]);

  const sliderVars: CSSProperties = { ["--current-index" as any]: currentIndex };

  const LEDE =
    "Divisi riset dari Ardhianzy yang mempublikasikan laporan-laporan penelitian bertema filosofis dan psikologis. Fokusnya adalah menggali pertanyaan-pertanyaan mendalam seputar eksistensi, kesadaran, emosi, nilai, dan pengalaman manusia. Setiap laporan disusun dengan standar akademik namun tetap komunikatif, menjembatani antara disiplin ilmu dan refleksi personal. Riset ini bukan sekadar angka, tetapi narasi dari dunia batin kita.";

  return (
    <>
      <style>{`
        .rs-head__dekWrap{
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
        .rs-head__dek{
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

        .rs-head__section::before {
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

        .rs-desc {
          font-size: 1rem !important;
          line-height: 1.5 !important;
          opacity: 0.9 !important;
          max-width: 450px !important;
          display: -webkit-box !important;
          text-align: justify;
          -webkit-line-clamp: 7 !important;
          -webkit-box-orient: vertical !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
        }

        .rs-article-slider {
          --card-w: 1029px;
          --card-gap: 30px;
          transform: translateX(
            calc(50% - (var(--card-w) / 2) - (var(--current-index) * (var(--card-w) + var(--card-gap))))
          ) !important;
        }
        @media (max-width: 1200px) {
          .rs-article-slider { --card-w: 90vw; --card-gap: 20px; }
        }
        @media (max-width: 768px) {
          .rs-article-slider { --card-w: 95vw; --card-gap: 15px; }
        }
      `}</style>

      <section
        className="relative flex h-[60vh] w-screen items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('${headingBackgroundUrl}')`,
          backgroundPosition: "start",
          height: "58vh",
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
        <h1 className="relative z-[2] font-bebas uppercase text-white text-center !text-[5rem] pb-20">
          {headingTitle}
        </h1>

        <div className="rs-head__dekWrap">
          <p className="rs-head__dek">{LEDE}</p>
        </div>
      </section>

      <section className="rs-head__section relative w-full bg-black py-5 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-[3]"
          style={{ width: "15%", maxWidth: 200, background: "" }}
        />
        
        <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
          <div className="relative h-[417px] w-full overflow-visible">
            <div
              className="rs-article-slider flex h-full items-center gap-[30px] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={sliderVars}
            >
              {(items.length ? items : loading ? [{ id: "skeleton", title: "", description: "", image: "" }] : []).map(
                (article, idx) => {
                  const isActive = idx === currentIndex;

                  const fullText = htmlToPlainText(article.description ?? "");
                  const { preview, truncated } = makePreviewByWords(fullText, 45);
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

                          <p className="rs-desc">
                            {preview}
                            {truncated && (
                              <>
                                {"…"} <ContinueReadInline />
                              </>
                            )}
                          </p>
                        </div>
                      </article>
                    </Link>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}