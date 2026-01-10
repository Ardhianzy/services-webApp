// src/features/research/components/ResearchHighlightSection.tsx
import { useState, useEffect, type CSSProperties, useMemo } from "react";
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

  const [ledeOpen, setLedeOpen] = useState(false);

  const isMobileNow = () => {
    if (typeof window === "undefined") return false;
    if (typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(max-width: 640px)").matches;
  };

  const openLedeModal = () => {
    if (!isMobileNow()) return;
    setLedeOpen(true);
  };

  const closeLedeModal = () => setLedeOpen(false);

  useEffect(() => {
    if (!ledeOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLedeModal();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [ledeOpen]);

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

        const latestOnly = mapped.length ? [mapped[0]] : [];
        setRemote(latestOnly);
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

  const LEDE_TEASER = "Divisi riset dari Ardhianzy yang mempublikasikan laporan-laporan...";
  const ledeTeaser = useMemo(() => LEDE_TEASER, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        .rs-head__title{
          position: relative !important;
          z-index: 2 !important;
          color: #fff !important;
          font-family: 'Bebas Neue', cursive !important;
          font-size: 5rem !important;
          text-align: center !important;
          text-transform: uppercase !important;
          letter-spacing: 0 !important;
          margin: 0 !important;
          padding-bottom: 80px !important;
        }

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

        .rs-head__ledeTrigger{
          display: none !important;
          pointer-events: auto !important;
          margin: 0 auto !important;
          width: 100% !important;
          font-family: Roboto, ui-sans-serif, system-ui !important;
          border: 0 !important;
          outline: 0 !important;
          cursor: pointer !important;

          color: #ECECEC !important;
          text-align: center !important;
          letter-spacing: .1px !important;

          border-top: 1px solid rgba(255,255,255,.18) !important;
          padding: .55rem .85rem !important;
          background: linear-gradient(180deg, rgba(0,0,0,.40), rgba(0,0,0,.18)) !important;
          backdrop-filter: blur(2px);
          box-shadow: 0 10px 26px rgba(0,0,0,.18);
        }
        .rs-head__ledeTriggerTop{
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          font-size: 0.85rem !important;
          opacity: .92 !important;
          margin-bottom: 6px !important;
          text-decoration: underline !important;
          text-underline-offset: 4px !important;
          text-decoration-color: rgba(255,255,255,.55) !important;
        }
        .rs-head__ledeTriggerText{
          display: block !important;
          font-size: 0.9rem !important;
          line-height: 1.45 !important;
          opacity: .95 !important;
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

        @media (max-width: 640px) {
          .rs-head__hero { height: 48vh !important; }

          .rs-head__title { font-size: 2.4rem !important; padding-bottom: 56px !important; }

          .rs-head__dekWrap { max-width: min(90vw, 62ch) !important; bottom: 14px !important; }
          .rs-head__dek { display: none !important; }
          .rs-head__ledeTrigger { display: block !important; border-radius: 14px !important; }

          .rs-card__overlay { padding: 18px 18px !important; }
          .rs-card__title { font-size: 2.4rem !important; max-width: 100% !important; }
          .rs-desc { -webkit-line-clamp: 6 !important; font-size: 0.95rem !important; line-height: 1.65 !important; }
        }
        @media (max-width: 420px) {
          .rs-head__hero { height: 46vh !important; }
          .rs-head__ledeTriggerText { font-size: 0.88rem !important; }
          .rs-desc { -webkit-line-clamp: 5 !important; }
        }

        .rs-head__ledeOverlay{
          position: fixed !important;
          inset: 0 !important;
          z-index: 80 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 18px 14px !important;
          background: rgba(0,0,0,.55) !important;
          backdrop-filter: blur(18px) !important;
          -webkit-backdrop-filter: blur(18px) !important;
        }
        .rs-head__ledeModal{
          width: min(92vw, 560px) !important;
          max-height: 70vh !important;
          overflow: auto !important;
          border-radius: 18px !important;
          border: 1px solid rgba(255,255,255,.12) !important;
          background: rgba(17,17,17,.92) !important;
          box-shadow: 0 18px 55px rgba(0,0,0,.55) !important;
          padding: 14px 14px 12px 14px !important;
        }
        .rs-head__ledeModalTop{
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 12px !important;
          margin-bottom: 10px !important;
        }
        .rs-head__ledeModalTitle{
          font-family: Roboto, ui-sans-serif, system-ui !important;
          font-size: 0.98rem !important;
          font-weight: 600 !important;
          color: #fff !important;
          margin: 0 !important;
          letter-spacing: .2px !important;
        }
        .rs-head__ledeClose{
          border: 1px solid rgba(255,255,255,.18) !important;
          background: rgba(0,0,0,.25) !important;
          color: #fff !important;
          border-radius: 999px !important;
          width: 34px !important;
          height: 34px !important;
          display: inline-grid !important;
          place-items: center !important;
          cursor: pointer !important;
          line-height: 1 !important;
          font-size: 18px !important;
        }
        .rs-head__ledeBody{
          font-family: Roboto, ui-sans-serif, system-ui !important;
          font-size: 0.98rem !important;
          line-height: 1.65 !important;
          color: rgba(255,255,255,.9) !important;
          margin: 0 !important;
        }
      `}</style>

      <section
        className="rs-head__hero relative flex h-[60vh] w-screen items-center justify-center bg-cover bg-center"
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
            background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, transparent 100%)",
          }}
        />

        <h1 className="rs-head__title">{headingTitle}</h1>

        <div className="rs-head__dekWrap">
          <p className="rs-head__dek">{LEDE}</p>

          <button
            type="button"
            className="rs-head__ledeTrigger"
            onClick={openLedeModal}
            aria-label="Buka teks pengantar riset"
            aria-haspopup="dialog"
            aria-expanded={ledeOpen}
          >
            <span className="rs-head__ledeTriggerTop">
              Tap to read intro <span aria-hidden>↗</span>
            </span>
            <span className="rs-head__ledeTriggerText">{ledeTeaser}</span>
          </button>
        </div>
      </section>

      {ledeOpen ? (
        <div
          className="rs-head__ledeOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Pengantar Research"
          onClick={closeLedeModal}
        >
          <div className="rs-head__ledeModal" onClick={(e) => e.stopPropagation()}>
            <div className="rs-head__ledeModalTop">
              <p className="rs-head__ledeModalTitle">Introduction</p>
              <button
                type="button"
                className="rs-head__ledeClose"
                onClick={closeLedeModal}
                aria-label="Tutup"
                title="Close"
              >
                ×
              </button>
            </div>

            <p className="rs-head__ledeBody">{LEDE}</p>
          </div>
        </div>
      ) : null}

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
                          className="rs-card__overlay absolute inset-0 flex flex-col items-start justify-start p-[30px] pr-[40px] text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
                          }}
                        >
                          <h3 className="rs-card__title font-bebas uppercase !text-[3.5rem] leading-[1] tracking-[2px] max-w-[500px] mb-[10px]">
                            {article.title}
                          </h3>

                          {article.researcher || dateHuman ? (
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