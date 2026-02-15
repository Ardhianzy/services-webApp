// src/features/reading-guides/components/ReadingGuideCollectionSection.tsx
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
      Continue to Read&nbsp;→
    </span>
  );
}

type GuideCard = {
  id: string | number;
  title: string;
  date: string;
  image: string;
  slug?: string;
  desc: string;
};

type Props = {
  guides?: GuideCard[];
};

export default function ReadingGuideCollectionSection({ guides }: Props) {
  const [remote, setRemote] = useState<GuideCard[]>([]);
  const [onlyOne, setOnlyOne] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        if (guides?.length) {
          setRemote(guides);
          setOnlyOne(guides.length <= 1);
          return;
        }
        const list = await contentApi.articles.list();
        if (!alive) return;

        const mapped = (list ?? [])
          .filter((a: ArticleDTO) => (a.category ?? "").toUpperCase() === "READING_GUIDLINE")
          .map((a: ArticleDTO) => {
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
            } as GuideCard & { _dateISO?: string | null };
          });

        const sortedDesc = mapped.slice().sort((a, b) => {
          const ta = new Date((a as any)._dateISO ?? "").getTime();
          const tb = new Date((b as any)._dateISO ?? "").getTime();
          return (tb || 0) - (ta || 0);
        });

        setOnlyOne(sortedDesc.length <= 1);
        const rest = sortedDesc.slice(1);
        setRemote(rest);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [guides]);

  const items: GuideCard[] = useMemo(() => (guides?.length ? guides : remote), [guides, remote]);
  const showEmpty = !loading && onlyOne;

  return (
    <section className="w-full bg-black text-white !py-[60px]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap');
        .rgc__bebas { font-family: 'Bebas Neue', cursive !important; }
        .rgc__roboto { font-family: 'Roboto', sans-serif !important; }

        .rgc-grid { grid-template-columns: repeat(3, 1fr); gap: 80px 40px; }
        .rgc-card .rgc-img { transition: transform .4s ease, filter .4s ease; border-radius: 8px; }
        .rgc-card:hover .rgc-img { filter: saturate(1.2); }

        @media (max-width: 992px) { .rgc-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) {
          .rgc-grid { grid-template-columns: 1fr; gap: 60px 0; }
          .rgc-img { height: 400px; }
          .rgc-title { font-size: 38px !important; }
        }

        @media (max-width: 640px) {
          .rgc-grid { gap: 52px 0 !important; }
          .rgc-img { height: 320px !important; }
          .rgc-title { font-size: 2.4rem !important; line-height: 1.05 !important; }
          .rgc-meta { font-size: 0.95rem !important; line-height: 1.4 !important; margin-bottom: -16px !important; }
          .rgc-descText { font-size: 0.95rem !important; line-height: 1.65 !important; max-width: 92% !important; }
          .rgc-heading { font-size: 2.4rem !important; line-height: 1.05 !important; }
        }
        @media (max-width: 420px) {
          .rgc-img { height: 280px !important; }
          .rgc-title { font-size: 2.2rem !important; }
        }
      `}</style>

      <div className="max-w-[1275px] mx-auto px-5 pb-40">
        <header className="border-t border-white !pt-5 !mb-[30px]">
          <h2 className="rgc__bebas rgc-heading !font-normal text-[48px] !leading-[58px] text-left m-0">
            OTHER ESSAYS
          </h2>
        </header>

        {showEmpty ? (
          <div className="rgc-grid grid">
            <article className="rgc-card text-center cursor-default mt-5">
              <div
                className="w-full h-[470px] bg-black mb-[10px]"
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
                  className="rgc__roboto rgc-meta text-[#B3B3B3] mb-[-23px] mt-4"
                  style={{ fontWeight: 300, fontSize: 17, lineHeight: "18px" }}
                ></p>
                <h3
                  className="rgc__bebas rgc-title mt-10"
                  style={{ fontWeight: 400, fontSize: 40, lineHeight: 1.1, textShadow: "0 4px 50px rgba(0,0,0,.25)" }}
                >
                  COMING SOON
                </h3>
                <p
                  className="rgc__roboto rgc-descText text-white/90 max-w-[90%] mx-auto"
                  style={{ fontSize: 16, lineHeight: 1.5, marginTop: 10 }}
                >
                  Our next essay is currently in preparation. Stay tuned!
                </p>
              </div>
            </article>
          </div>
        ) : null}

        {!showEmpty && items.length > 0 && (
          <>
            <div className="rgc-grid grid">
              {items.slice(0, 9).map((g) => {
                const preview = truncateWords(g.desc, 45);
                const showDots = (g.desc ?? "").trim().length > preview.trim().length;
                const href = g.slug ? ROUTES.ESSAY_DETAIL.replace(":slug", g.slug) : ROUTES.ESSAY;

                return (
                  <Link key={g.id} to={href} className="block" style={{ textDecoration: "none" }}>
                    <article className="rgc-card text-center cursor-pointer mt-5">
                      <div
                        className="rgc-img w-full h-[470px] bg-cover bg-center bg-black mb-[10px]"
                        style={{ backgroundImage: `url(${g.image})`, backgroundBlendMode: "luminosity" }}
                        aria-label={g.title}
                      />
                      <div className="flex flex-col items-center">
                        <p
                          className="rgc__roboto rgc-meta text-[#B3B3B3] mb-[-23px] mt-4"
                          style={{ fontWeight: 300, fontSize: 17, lineHeight: "18px" }}
                        >
                          {g.date}
                        </p>
                        <h3
                          className="rgc__bebas rgc-title mt-10"
                          style={{ fontWeight: 400, fontSize: 40, lineHeight: 1.1, textShadow: "0 4px 50px rgba(0,0,0,.25)" }}
                        >
                          {g.title}
                        </h3>
                        <p
                          className="rgc__roboto rgc-descText text-white/90 max-w-[90%] mx-auto"
                          style={{ fontSize: 16, lineHeight: 1.5, marginTop: 10 }}
                        >
                          {preview}
                          {showDots ? "..." : ""} <ContinueReadInline />
                        </p>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

            {items.length > 9 && (
              <div className="rgc-grid grid mt-[80px]">
                {items.slice(9).map((g) => {
                  const preview = truncateWords(g.desc, 45);
                  const showDots = (g.desc ?? "").trim().length > preview.trim().length;
                  const href = g.slug ? ROUTES.ESSAY_DETAIL.replace(":slug", g.slug) : ROUTES.ESSAY;

                  return (
                    <Link key={g.id} to={href} className="block" style={{ textDecoration: "none" }}>
                      <article className="rgc-card text-center cursor-pointer">
                        <div
                          className="rgc-img w-full h-[470px] bg-cover bg-center bg-black mb-[10px]"
                          style={{ backgroundImage: `url(${g.image})`, backgroundBlendMode: "luminosity" }}
                          aria-label={g.title}
                        />
                        <div className="flex flex-col items-center">
                          <p
                            className="rgc__roboto rgc-meta text-[#B3B3B3] mb-[-23px] mt-4"
                            style={{ fontWeight: 300, fontSize: 15, lineHeight: "18px" }}
                          >
                            {g.date}
                          </p>
                          <h3
                            className="rgc__bebas rgc-title mt-10"
                            style={{ fontWeight: 400, fontSize: 48, lineHeight: 1.1, textShadow: "0 4px 50px rgba(0,0,0,.25)" }}
                          >
                            {g.title}
                          </h3>
                          <p
                            className="rgc__roboto rgc-descText text-white/90 max-w-[90%] mx-auto"
                            style={{ fontSize: 18, lineHeight: 1.5, marginTop: 10 }}
                          >
                            {preview}
                            {showDots ? "..." : ""} <ContinueReadInline />
                          </p>
                        </div>
                      </article>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}