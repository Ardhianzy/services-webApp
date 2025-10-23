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
      Continue Read&nbsp;→
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

  useEffect(() => {
    let alive = true;
    if (articles && articles.length) {
      setRemote(articles);
      return;
    }
    (async () => {
      const list = await contentApi.research.list();
      if (!alive) return;
        const mapped: ResearchArticle[] = (list ?? []).map((r: ResearchDTO) => ({
          id: r.id,
          date: formatPrettyDate(r.research_date || r.pdf_uploaded_at || r.created_at || ""),
          title: r.research_title,
          desc: r.research_sum,
          image: r.image ?? "",
          slug: r.slug,
        }));
        setRemote(mapped);
    })();
    return () => {
      alive = false;
    };
  }, [articles]);

  const items = useMemo(() => (articles && articles.length ? articles : remote), [articles, remote]);

  return (
    <section className="w-full bg-black text-white py-20">
      <style>{`
        .rs__loadwrap { /* commented out (kept for reference)
          position: absolute !important; left:0 !important; bottom:0 !important;
          width:100% !important; height:150px !important; display:flex !important;
          justify-content:center !important; align-items:flex-end !important;
          background:linear-gradient(0deg,#000 16.35%,rgba(0,0,0,0) 100%) !important;
          z-index:5 !important; pointer-events:none !important; padding-bottom:2rem !important;
          opacity:1 !important; visibility:visible !important; transition:opacity .35s ease, visibility 0s linear 0s !important;
        } */
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
      `}</style>

      <div className="max-w-[1331px] mx-auto px-5">
        <h2 className="mb-10 mt-10 border-t border-white pt-5 text-left font-bebas !text-[48px] leading-[58px]">
          LATEST RESEARCH
        </h2>

        <div className="relative">
          <div className="flex flex-col !gap-[60px]">
            {items.map((article) => {
              const preview = truncateByPhraseOrWords(
                article.desc ?? "",
                "sekaligus",
                55
              );
              const showEllipsis = (article.desc ?? "").trim().length > preview.trim().length;

              return (
                <Link
                  key={article.id}
                  to={article.slug ? `/research/${article.slug}` : ROUTES.RESEARCH} 
                  className="block"
                  style={{ textDecoration: "none" }}
                >
                  <article className="flex items-center !gap-[30px] max-[1200px]:flex-col max-[1200px]:items-start">
                    <div className="shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="block rounded-[16px] border-l-2 border-[#444444] object-cover !w-[599px] !h-[365px] filter grayscale max-[1200px]:!w-full max-[1200px]:!h-auto"
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

          {/* LOAD MORE di-nonaktifkan
          <div className={["rs__loadwrap", "rs__loadwrap--hidden"].join(" ")} aria-hidden>
            <button type="button" className="rs__loadbtn">LOAD MORE...</button>
          </div>
          */}
        </div>
      </div>
    </section>
  );
}