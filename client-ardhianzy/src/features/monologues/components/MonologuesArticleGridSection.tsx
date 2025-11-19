// src/features/monologues/components/MonologuesArticleGridSection.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { contentApi } from "@/lib/content/api";
import type { MonologueDTO } from "@/lib/content/types";
import { ROUTES } from "@/app/routes";

export type MonologueArticle = {
  id: number | string;
  date: string;
  title: string;
  desc: string;
  image: string;
  slug?: string;
};

type Props = {
  articles?: MonologueArticle[];
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

export default function MonologuesArticleGridSection({ articles }: Props) {
  const [remote, setRemote] = useState<MonologueArticle[]>([]);
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
        const list = await contentApi.monologues.list();
        if (!alive) return;

        const sorted = (list ?? []).slice().sort((a, b) => {
          const ta = new Date((a.pdf_uploaded_at || a.created_at || "") as string).getTime();
          const tb = new Date((b.pdf_uploaded_at || b.created_at || "") as string).getTime();
          return (tb || 0) - (ta || 0);
        });

        setOnlyOne(sorted.length <= 1);

        const rest = sorted.slice(1);

        const mapped: MonologueArticle[] = rest.map((m: MonologueDTO) => ({
          id: m.id,
          date: formatPrettyDate(m.pdf_uploaded_at || m.created_at || ""),
          title: m.title,
          desc: htmlToPlainText(m.dialog ?? ""),
          image: m.image ?? "",
          slug: m.slug,
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
    <section className="w-full bg-black text-white py-20">
      <style>{`
        .rs__loadwrap { /* kept for parity; disabled */
          display:none !important;
        }
      `}</style>

      <div className="max-w-[1331px] mx-auto px-5 pb-40">
        <h2 className="mb-10 mt-10 border-t border-white pt-5 text-left font-bebas !text-[48px] leading-[58px]">
          OTHER MONOLOGUES
        </h2>

        {showComingSoon ? (
          <div className="relative">
            <div className="flex flex-col !gap-[60px]">
              <article className="flex items-center !gap-[30px] max-[1200px]:flex-col max-[1200px]:items-start">
                <div className="shrink-0">
                  <img
                    src={"/assets/monologues/placeholder.png"}
                    alt="Coming Soon"
                    className="block rounded-[16px] border-l-2 border-[#444444] object-contain p-14 object-top !w-[599px] !h-[365px] filter grayscale max-[1200px]:!w-full max-[1200px]:!h-auto"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/assets/icon/Ardhianzy_Logo_2.png";
                    }}
                  />
                </div>

                <div className="flex flex-col items-start !max-w-[552px] max-[1200px]:max-w-full max-[1200px]:pt-5">
                  <p className="font-roboto italic !font-extralight !text-[20px] text-white !leading-[1] !mb-[24px]">
                  </p>

                  <h3 className="font-bebas !font-normal !text-[58px] text-white !leading-[1] text-shadow-article !mb-[14px]">
                    COMING SOON
                  </h3>

                  <p className="font-roboto !text-[18px] !leading-[1.5] text-justify text-white">
                    Our next monologue publication is currently in preparation. Stay tuned!
                  </p>
                </div>
              </article>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="flex flex-col !gap-[60px]">
              {items.map((article) => {
                const preview = truncateByPhraseOrWords(article.desc ?? "", "sekaligus", 55);
                const showEllipsis = (article.desc ?? "").trim().length > preview.trim().length;

                return (
                  <Link
                    key={article.id}
                    to={article.slug ? `/monologues/${article.slug}` : ROUTES.MONOLOGUES}
                    className="block"
                    style={{ textDecoration: "none" }}
                  >
                    <article className="flex items-center !gap-[30px] max-[1200px]:flex-col max-[1200px]:items-start">
                      <div className="shrink-0">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="block rounded-[16px] border-l-2 border-[#444444] object-cover object-top !w-[599px] !h-[365px] filter grayscale max-[1200px]:!w-full max-[1200px]:!h-auto"
                        />
                      </div>

                      <div className="flex flex-col items-start !max-w-[552px] max-[1200px]:max-w-full max-[1200px]:pt-5">
                        <p className="font-roboto italic !font-extralight !text-[20px] text-white !leading-[1] !mb-[24px]">
                          {article.date}
                        </p>

                        <h3 className="font-bebas !font-normal !text-[58px] text-white !leading-[1] text-shadow-article !mb-[14px]">
                          {article.title}
                        </h3>

                        <p className="font-roboto !text-[18px] !leading-[1.5] text-justify text-white">
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