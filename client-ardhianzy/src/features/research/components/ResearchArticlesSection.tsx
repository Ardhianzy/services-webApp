// src/features/research/components/ResearchArticlesSection.tsx
import { useEffect, useMemo, useState } from "react";
import { contentApi } from "@/lib/content/api";
import type { ResearchDTO } from "@/lib/content/types";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/routes";

export type ResearchArticle = {
  id: number | string;
  date: string;
  title: string;
  desc: string;
  image: string;
  slug?: string;
};

type Props = {
  articles?: ResearchArticle[];
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

function formatPrettyDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const month = d.toLocaleString("en-US", { month: "long" });
  return `${month} ${d.getDate()}, ${d.getFullYear()}`;
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

function truncateByPhraseOrWords(text: string, phrase: string, maxWords: number) {
  const safe = (text ?? "").trim();
  if (!safe) return "";
  const idx = safe.toLowerCase().indexOf(phrase.toLowerCase());
  if (idx !== -1) return safe.slice(0, idx + phrase.length).trim().replace(/\s+$/, "");
  const words = safe.split(/\s+/);
  if (words.length <= maxWords) return safe;
  return words.slice(0, maxWords).join(" ").replace(/[,\.;:!?\-—]+$/, "");
}

export default function ResearchArticlesSection({ articles }: Props) {
  const [remote, setRemote] = useState<ResearchArticle[]>([]);
  const [onlyOne, setOnlyOne] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    if (articles && articles.length) {
      setRemote(articles);
      setOnlyOne(articles.length <= 1);
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

        setOnlyOne(sorted.length <= 1);

        const rest = sorted.slice(1);

        const mapped: ResearchArticle[] = rest.map((r: ResearchDTO) => ({
          id: r.id,
          date: formatPrettyDate(r.research_date || r.pdf_uploaded_at || r.created_at || ""),
          title: r.research_title,
          desc: htmlToPlainText(r.research_sum ?? ""),
          image: r.image ?? "",
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

  const items = useMemo(() => (articles && articles.length ? articles : remote), [articles, remote]);
  const showComingSoon = !loading && onlyOne;

  return (
    <section className="rscol w-full bg-black text-white py-20">
      <style>{`
        .rs__loadwrap--hidden { opacity:0 !important; visibility:hidden !important; transition:opacity .35s ease, visibility 0s linear .35s !important; }
        .rs__loadbtn {
          font-family: 'Bebas Neue', cursive !important;
          font-size: 42px !important;
          letter-spacing: .05em !important;
          color: #FFFFFF !important;
          background: none !important;
          border: none !important;
          cursor: pointer !important;
          transition: opacity .3s ease !important;
          pointer-events: all !important;
          outline: none !important;
          box-shadow: none !important;
          -webkit-tap-highlight-color: transparent !important;
          appearance: none !important;
        }
        .rs__loadbtn:hover { opacity: .8 !important; }
        .fx-curtainDown { position: relative !important; overflow: hidden !important; }
        .fx-curtainDown::before {
          content: '' !important; position: absolute !important; inset: 0 !important; z-index: 2 !important;
          background: #000 !important; transform-origin: bottom !important; transform: scaleY(1) !important;
          transition: transform .6s cubic-bezier(.25,.8,.3,1) !important; pointer-events: none !important;
        }
        .fx-curtainDown.is-open::before { transform: scaleY(0) !important; }

        .rscol__title{ font-weight: 400 !important; }

        @media (max-width: 640px) {
          .rscol { padding-top: 3rem !important; padding-bottom: 3rem !important; }
          .rscol__container { width: 92% !important; padding-left: 0 !important; padding-right: 0 !important; padding-bottom: 72px !important; }

          .rscol__title {
            font-size: 2.4rem !important;
            line-height: 1.1 !important;
            margin-bottom: 2rem !important;
            padding-top: 14px !important;
          }

          .rscol__stack { gap: 2.5rem !important; }

          .rscol__article { gap: 18px !important; }

          .rscol__img {
            width: 100% !important;
            height: 240px !important;
            border-radius: 16px !important;
          }
          .rscol__img--soon { padding: 32px !important; object-fit: contain !important; }

          .rscol__date {
            font-size: 1rem !important;
            margin-bottom: 1.4rem !important;
            line-height: 1.15 !important;
          }

          .rscol__h3 {
            font-size: 2.4rem !important;
            line-height: 1.1 !important;
            margin-bottom: 12px !important;
          }

          .rscol__desc {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 6 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }
        }

        @media (max-width: 420px) {
          .rscol__img { height: 220px !important; }
          .rscol__desc { -webkit-line-clamp: 5 !important; }
        }
      `}</style>

      <div className="rscol__container max-w-[1331px] mx-auto px-5 pb-40">
        <h2 className="rscol__title mb-10 mt-10 border-t border-white pt-5 text-left font-bebas text-[48px] leading-[58px]">
          OTHER RESEARCH
        </h2>

        {showComingSoon ? (
          <div className="relative">
            <div className="rscol__stack flex flex-col !gap-[60px]">
              <article className="rscol__article flex items-center !gap-[30px] max-[1200px]:flex-col max-[1200px]:items-start">
                <div className="shrink-0">
                  <img
                    src={"/assets/research/placeholder.png"}
                    alt="Coming Soon"
                    className="rscol__img rscol__img--soon block rounded-[16px] border-l-2 border-[#444444] object-contain p-14 !w-[599px] !h-[365px] filter grayscale max-[1200px]:!w-full max-[1200px]:!h-auto"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/assets/icon/Ardhianzy_Logo_2.png";
                    }}
                  />
                </div>

                <div className="flex flex-col items-start !max-w-[552px] max-[1200px]:max-w-full max-[1200px]:pt-5">
                  <p className="rscol__date font-roboto italic !font-extralight !text-[20px] text-white !leading-[1] !mb-[24px]"></p>

                  <h3 className="rscol__h3 font-bebas !font-normal !text-[58px] text-white !leading-[1] text-shadow-article !mb-[14px]">
                    COMING SOON
                  </h3>

                  <p className="rscol__desc font-roboto !text-[18px] !leading-[1.5] text-justify text-white">
                    Our next research publication is currently in preparation. Stay tuned!
                  </p>
                </div>
              </article>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="rscol__stack flex flex-col !gap-[60px]">
              {items.map((article) => {
                const preview = truncateByPhraseOrWords(article.desc ?? "", "sekaligus", 55);
                const showEllipsis = (article.desc ?? "").trim().length > preview.trim().length;

                return (
                  <Link
                    key={article.id}
                    to={article.slug ? `/research/${article.slug}` : ROUTES.RESEARCH}
                    className="block"
                    style={{ textDecoration: "none" }}
                  >
                    <article className="rscol__article flex items-center !gap-[30px] max-[1200px]:flex-col max-[1200px]:items-start">
                      <div className="shrink-0">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="rscol__img block rounded-[16px] border-l-2 border-[#444444] object-cover !w-[599px] !h-[365px] filter grayscale max-[1200px]:!w-full max-[1200px]:!h-auto"
                        />
                      </div>

                      <div className="flex flex-col items-start !max-w-[552px] max-[1200px]:max-w-full max-[1200px]:pt-5">
                        <p className="rscol__date font-roboto italic !font-extralight !text-[20px] text-white !leading-[1] !mb-[24px]">
                          {article.date}
                        </p>

                        <h3 className="rscol__h3 font-bebas !font-normal !text-[58px] text-white !leading-[1] text-shadow-article !mb-[14px]">
                          {article.title}
                        </h3>

                        <p className="rscol__desc font-roboto !text-[18px] !leading-[1.5] text-justify text-white">
                          {preview}
                          {showEllipsis ? "..." : ""} <ContinueReadInline />
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}