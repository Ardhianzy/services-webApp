// src/features/reading-guides/pages/ReadingGuideDetailPage.tsx
import { useParams, Link } from "react-router-dom";
import { useArticleDetail } from "@/lib/content/api";
import type { ArticleDTO } from "@/lib/content/types";

function normalizeBackendHtml(payload?: string | null): string {
  if (!payload) return "";
  let s = payload.trim();
  s = s
    .replace(/\\u003C/gi, "<")
    .replace(/\\u003E/gi, ">")
    .replace(/\\u0026/gi, "&")
    .replace(/\\"/g, '"');
  s = s.replace(/^\s*"?content"?\s*:\s*"?/i, "");
  s = s.replace(/"\s*$/, "");
  const firstTag = Math.max(s.indexOf("<"), s.indexOf("\u003C"));
  if (firstTag > 0) s = s.slice(firstTag);
  s = s.replace(/<p>\s*<\/p>/g, "");
  if (!/<[a-z][\s\S]*>/i.test(s)) s = s ? `<p>${s}</p>` : "";
  return s.trim();
}

function ArticleBody({ html }: { html: string }) {
  return (
    <>
      <style>{`
        .article-typography {
          font-family: Roboto, ui-sans-serif, system-ui;
          font-size: 1.05rem;
          line-height: 1.9;
          color: #fff;
          text-align: justify;
          text-justify: inter-word;
          hyphens: auto;
          word-break: break-word;
        }
        .article-typography h1,.article-typography h2,.article-typography h3{
          font-family: "Bebas Neue", Roboto, sans-serif;
          line-height: 1.15; margin:1.2em 0 .4em; letter-spacing:.4px;
        }
        .article-typography h1{font-size:clamp(2rem,5vw,3.2rem)}
        .article-typography h2{font-size:clamp(1.7rem,4vw,2.4rem)}
        .article-typography h3{font-size:clamp(1.4rem,3.2vw,1.9rem)}
        .article-typography p{margin:0 0 1.05em}
        .article-typography blockquote{margin:1.2em 0;padding:.8em 1em .8em 1.1em;border-left:3px solid rgba(255,255,255,.35);background:rgba(255,255,255,.04);border-radius:8px}
        .article-typography blockquote p{margin:.5em 0}
        .article-typography blockquote footer{margin-top:.6em;opacity:.85;font-size:.92em}
        .article-typography ul,.article-typography ol{margin:.7em 0 1.2em;padding-left:1.4em}
        .article-typography ul{list-style:disc}
        .article-typography ol{list-style:decimal}
        .article-typography img,.article-typography video,.article-typography iframe{max-width:100%;height:auto}
        .article-typography a{color:#fff;text-decoration:underline;text-underline-offset:2px;text-decoration-color:rgba(255,255,255,.6)}
        @media (max-width:768px){.article-typography{font-size:1rem;line-height:1.85}}
      `}</style>
      <div className="article-typography" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

export default function ReadingGuideDetailPage() {
  const { slug = "" } = useParams();
  const { data, loading } = useArticleDetail(slug, { category: "READING_GUIDLINE" });

  const title = (data as ArticleDTO | null)?.title ?? "Reading Guide";
  const contentHtml =
    normalizeBackendHtml((data as ArticleDTO | null)?.content) ||
    normalizeBackendHtml((data as ArticleDTO | null)?.meta_description);

  if (loading) {
    return (
      <main className="bg-black text-white pt-[240px] pb-[80px] min-h-screen">
        <section className="container-fluid">
          <div className="mx-auto maxw-desktop">
            <div className="mb-6 h-8 w-2/3 animate-pulse rounded bg-white/10" />
            <div className="aspect-[16/9] w-full animate-pulse rounded-xl bg-white/10" />
            <div className="mt-6 space-y-4">
              <div className="h-4 w-full animate-pulse rounded bg-white/10" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-10/12 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-black text-white pt-[119px] pb-[80px] min-h-screen">
      {/* <section
        className="relative w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[46vh] min-h-[320px] max-h-[560px] overflow-hidden"
        aria-label="Guide hero"
      >
        <img
          src={data?.image ?? "/assets/readingGuide/belajar2.png"}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "grayscale(100%)", mixBlendMode: "luminosity" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <h1
          className="absolute inset-x-0 bottom-[44%] m-0 text-center text-white"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.2rem,6vw,4.6rem)", lineHeight: 1.05 }}
        >
          {title}
        </h1>
      </section> */}

      <article className="w-full mx-auto py-[clamp(24px,4vw,64px)]">
        <div className="mx-auto maxw-desktop">
          <div className="mb-3 text-sm text-white/50">
            <Link to="/" className="hover:opacity-80">Home</Link>
            <span className="mx-2 opacity-50">/</span>
            <Link to="/reading-guide" className="hover:opacity-80">Reading Guide</Link>
          </div>

          <h1
            className="mt-10 text-fluid-xl leading-[1.05] tracking-tight mb-[clamp(12px,2vw,20px)]"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {title}
          </h1>

          {data?.image && (
            <figure className="mb-[clamp(18px,3vw,28px)]">
              <div className="relative w-full overflow-hidden rounded-xl border border-white/10">
                <img src={data.image} alt={data.title ?? ""} className="block w-full h-auto object-cover" />
              </div>
            </figure>
          )}

          <ArticleBody html={contentHtml} />
        </div>
      </article>
    </main>
  );
}