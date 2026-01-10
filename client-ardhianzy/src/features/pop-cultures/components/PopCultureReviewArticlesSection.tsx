// src/features/pop-cultures/components/PopCultureReviewArticlesSection.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { contentApi } from "@/lib/content/api";
import type { ArticleDTO } from "@/lib/content/types";
import { ROUTES } from "@/app/routes";

function formatPrettyDate(iso?: string | null) {
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

type ArticleCard = {
  id: string | number;
  title: string;
  date: string;
  image: string;
  slug?: string;
  desc: string;
  _dateISO?: string | null;
};
type Props = {
  articles?: ArticleCard[];
};

export default function PopCultureReviewArticlesSection({ articles }: Props) {
  const [remote, setRemote] = useState<ArticleCard[]>([]);
  const [onlyOne, setOnlyOne] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    if (articles?.length) {
      setRemote(articles);
      setOnlyOne(articles.length <= 1);
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const list = await contentApi.articles.list({ category: "POP_CULTURE" });
        if (!alive) return;

        const mapped: ArticleCard[] = (list ?? []).map((a: ArticleDTO) => {
          const html =
            normalizeBackendHtml(a.meta_description) ||
            normalizeBackendHtml(a.excerpt) ||
            normalizeBackendHtml(a.content);
          const desc = stripHtml(html);
          return {
            id: a.id,
            title: a.title ?? "Untitled",
            date: formatPrettyDate(a.date || a.created_at || ""),
            image: a.image ?? "",
            slug: a.slug,
            desc,
            _dateISO: a.date || a.created_at || "",
          };
        });

        const sortedDesc = mapped.slice().sort((a, b) => {
          const ta = new Date(a._dateISO ?? "").getTime();
          const tb = new Date(b._dateISO ?? "").getTime();
          return (tb || 0) - (ta || 0);
        });

        setOnlyOne(sortedDesc.length <= 1);
        setRemote(sortedDesc.slice(1));
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [articles]);

  const items: ArticleCard[] = useMemo(() => (articles?.length ? articles : remote), [articles, remote]);

  const showComingSoon = !loading && onlyOne;

  const first = items.slice(0, 9);
  const extra = items.slice(9);

  return (
    <section className="w-full bg-black text-white py-[60px]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap');

        .pc__bebas { font-family: 'Bebas Neue', cursive !important; }
        .pc__roboto { font-family: 'Roboto', sans-serif !important; }

        .fx-curtainDown { position: relative !important; overflow: hidden !important; }
        .fx-curtainDown::before{
          content:'' !important; position:absolute !important; inset:0 !important; z-index:2 !important;
          background:#000 !important; transform-origin:bottom !important; transform:scaleY(1) !important;
          transition:transform .6s cubic-bezier(.25,.8,.3,1) !important; pointer-events:none !important;
        }
        .fx-curtainDown.is-open::before{ transform:scaleY(0) !important; }

        .pcr__loadwrap--visible{ opacity:1 !important; visibility:visible !important; transition:opacity .35s ease, visibility 0s linear 0s !important; }
        .pcr__loadwrap--hidden{  opacity:0 !important; visibility:hidden !important; transition:opacity .35s ease, visibility 0s linear .35s !important; }

        .pcr__loadbtn{
          pointer-events:auto !important; cursor:pointer !important; background:none !important; border:none !important;
          outline:none !important; box-shadow:none !important; -webkit-tap-highlight-color:transparent !important; appearance:none !important;
          font-family:'Bebas Neue',cursive !important; font-weight:400 !important; font-size:42px !important; line-height:48px !important;
          letter-spacing:.05em !important; color:#FFFFFF !important; transition:opacity .3s ease !important;
        }
        .pcr__loadbtn:hover{ opacity:.8 !important; }

        .pc-grid { grid-template-columns: repeat(3, 1fr); gap: 80px 40px; }

        .pc-card .pc-img { transition: transform .4s ease, filter .4s ease; border-radius: 8px; }
        .pc-card:hover .pc-img { filter: saturate(1.2); }

        @media (max-width: 992px) { .pc-grid { grid-template-columns: repeat(2, 1fr); } }

        @media (max-width: 768px) {
          .pc-grid { grid-template-columns: 1fr; gap: 60px 0; }
          .pc-img { height: 400px; }
          .pc-title { font-size: 2.4rem !important; }
          .pc-date { font-size: 15px !important; line-height: 18px !important; }
          .pc-preview { font-size: 16px !important; line-height: 1.5 !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1275px] px-5 pb-40">
        <header className="border-t border-white !pt-5 !mb-[30px]">
          <h2 className="pc__bebas pc-title !font-normal text-[48px] !leading-[58px] text-left m-0">
            OTHER POPSOPHIA
          </h2>
        </header>

        {showComingSoon ? (
          <div className="pc-grid grid">
            <article className="pc-card text-center cursor-default mt-5">
              <div
                className="w-full h-[470px] mb-[10px]"
                style={{
                  backgroundImage: `url('/assets/icon/Ardhianzy_Logo_2.png')`,
                  backgroundBlendMode: "luminosity",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                }}
                aria-label="Coming Soon"
              />
              <div className="flex flex-col items-center">
                <p
                  className="pc__roboto pc-date text-[#B3B3B3] mb-[-23px] mt-4"
                  style={{ fontWeight: 300, fontSize: "17px", lineHeight: "18px" }}
                ></p>
                <h3
                  className="pc__bebas pc-title mt-10"
                  style={{
                    fontWeight: 400,
                    fontSize: "40px",
                    lineHeight: 1.1,
                    textShadow: "0px 4px 50px rgba(0,0,0,0.25)",
                  }}
                >
                  COMING SOON
                </h3>

                <p
                  className="pc__roboto pc-preview text-white/90 max-w-[90%] mx-auto"
                  style={{ fontSize: 16, lineHeight: 1.5, marginTop: 10 }}
                >
                  Our next popsophia is currently in preparation. Stay tuned!
                </p>
              </div>
            </article>
          </div>
        ) : (
          <>
            <div className="pc-grid grid">
              {first.map((article) => {
                const preview = truncateWords(article.desc ?? "", 45);
                const showEllipsis = (article.desc ?? "").trim().length > (preview ?? "").trim().length;

                const href = article.slug
                  ? ROUTES.POP_CULTURE_REVIEW_DETAIL.replace(":slug", article.slug)
                  : ROUTES.POP_CULTURE_REVIEW;

                return (
                  <Link key={article.id} to={href} className="block" style={{ textDecoration: "none" }}>
                    <article className="pc-card text-center cursor-pointer mt-5">
                      <div
                        className="pc-img w-full h-[470px] bg-cover bg-black mb-[10px]"
                        style={{
                          backgroundImage: `url(${article.image})`,
                          backgroundBlendMode: "luminosity",
                          backgroundPosition: "top",
                        }}
                        aria-label={article.title}
                      />
                      <div className="flex flex-col items-center">
                        <p
                          className="pc__roboto pc-date text-[#B3B3B3] mb-[-23px] mt-4"
                          style={{ fontWeight: 300, fontSize: "17px", lineHeight: "18px" }}
                        >
                          {article.date}
                        </p>
                        <h3
                          className="pc__bebas pc-title mt-10"
                          style={{
                            fontWeight: 400,
                            fontSize: "40px",
                            lineHeight: 1.1,
                            textShadow: "0px 4px 50px rgba(0,0,0,0.25)",
                          }}
                        >
                          {article.title}
                        </h3>

                        <p
                          className="pc__roboto pc-preview text-white/90 max-w-[90%] mx-auto"
                          style={{ fontSize: 16, lineHeight: 1.5, marginTop: 10 }}
                        >
                          {preview}
                          {showEllipsis && (
                            <>
                              … <ContinueReadInline />
                            </>
                          )}
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

            <div className="pc-grid grid mt-[80px]">
              {extra.map((article) => {
                const preview = truncateWords(article.desc ?? "", 45);
                const showEllipsis = (article.desc ?? "").trim().length > (preview ?? "").trim().length;

                const href = article.slug
                  ? ROUTES.POP_CULTURE_REVIEW_DETAIL.replace(":slug", article.slug)
                  : ROUTES.POP_CULTURE_REVIEW;

                return (
                  <Link key={article.id} to={href} className="block" style={{ textDecoration: "none" }}>
                    <article className="pc-card text-center cursor-pointer">
                      <div
                        className="pc-img w-full h-[470px] bg-cover bg-black mb-[10px]"
                        style={{
                          backgroundImage: `url(${article.image})`,
                          backgroundBlendMode: "luminosity",
                          backgroundPosition: "top",
                        }}
                        aria-label={article.title}
                      />
                      <div className="flex flex-col items-center">
                        <p
                          className="pc__roboto pc-date text-[#B3B3B3] mb-[-23px] mt-4"
                          style={{ fontWeight: 300, fontSize: "15px", lineHeight: "18px" }}
                        >
                          {article.date}
                        </p>
                        <h3
                          className="pc__bebas pc-title mt-10"
                          style={{
                            fontWeight: 400,
                            fontSize: "48px",
                            lineHeight: 1.1,
                            textShadow: "0px 4px 50px rgba(0,0,0,0.25)",
                          }}
                        >
                          {article.title}
                        </h3>

                        <p
                          className="pc__roboto pc-preview text-white/90 max-w-[90%] mx-auto"
                          style={{ fontSize: 18, lineHeight: 1.5, marginTop: 10 }}
                        >
                          {preview}
                          {showEllipsis && (
                            <>
                              … <ContinueReadInline />
                            </>
                          )}
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}