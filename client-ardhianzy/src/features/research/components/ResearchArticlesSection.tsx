// src/features/research/components/ResearchArticlesSection.tsx
import { useState, useMemo } from "react";
import { useHybridArticles } from "@/features/articles/hooks";

export type ResearchArticle = {
  id: number | string;
  date: string;
  title: string;
  desc: string;
  image: string;
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

export default function ResearchArticlesSection({ articles }: Props) {
  const { articles: hybrid } = useHybridArticles();

  const articlesFromStore: ResearchArticle[] = useMemo(
    () =>
      (hybrid as any[])
        .filter((a) => a.section === "research" && a.category !== "Highlight")
        .map((a) => ({
          id: a.id,
          date: formatPrettyDate(a.publishedAt),
          title: a.title,
          desc: a.excerpt,
          image: a.image ?? a.cover,
        })),
    [hybrid]
  );

  const articlesToRender =
    articles && articles.length > 0 ? articles : articlesFromStore;

  const INITIAL_COUNT = 4;
  const first = articlesToRender.slice(0, INITIAL_COUNT);
  const extra = articlesToRender.slice(INITIAL_COUNT);

  const [isExpanded, setIsExpanded] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(extra.length > 0);

  const handleLoadMore = () => {
    setIsExpanded(true);
    requestAnimationFrame(() => {
      setCurtainOpen(true);
      setOverlayVisible(false);
    });
  };

  return (
    <section className="w-full bg-black text-white py-20">
      <style>{`
        .rs__loadwrap {
          position: absolute !important;
          left: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 150px !important;
          display: flex !important;
          justify-content: center !important;
          align-items: flex-end !important;
          background: linear-gradient(0deg, #000000 16.35%, rgba(0,0,0,0) 100%) !important;
          z-index: 5 !important;
          pointer-events: none !important;
          padding-bottom: 2rem !important;
          opacity: 1 !important;
          visibility: visible !important;
          transition: opacity .35s ease, visibility 0s linear 0s !important;
        }
        .rs__loadwrap--hidden {
          opacity: 0 !important;
          visibility: hidden !important;
          transition: opacity .35s ease, visibility 0s linear .35s !important;
        }
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
          content: '' !important;
          position: absolute !important;
          inset: 0 !important;
          z-index: 2 !important;
          background: #000 !important;
          transform-origin: bottom !important;
          transform: scaleY(1) !important;
          transition: transform .6s cubic-bezier(.25,.8,.3,1) !important;
          pointer-events: none !important;
        }
        .fx-curtainDown.is-open::before {
          transform: scaleY(0) !important;
        }
      `}</style>

      <div className="max-w-[1331px] mx-auto px-5">
        <h2 className="mb-10 mt-10 border-t border-white pt-5 text-left font-bebas !text-[48px] leading-[58px]">
          LATEST RESEARCH
        </h2>

        <div className="relative">
          <div className="flex flex-col !gap-[60px]">
            {first.map((article) => (
              <article
                key={article.id}
                className="flex items-center !gap-[30px] max-[1200px]:flex-col max-[1200px]:items-start"
              >
                <div className="shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="block object-cover !w-[599px] !h-[365px] filter grayscale max-[1200px]:!w-full max-[1200px]:!h-auto"
                  />
                </div>

                <div className="flex flex-col items-start !max-w-[552px] max-[1200px]:max-w-full max-[1200px]:pt-5">
                  <p className="font-roboto italic !font-extralight !text-[26px] text-white !leading-[1] !mb-[24px]">
                    {article.date}
                  </p>

                  <h3 className="font-bebas !font-normal !text-[64px] text-white !leading-[1] text-shadow-article !mb-[14px]">
                    {article.title}
                  </h3>

                  <p className="font-roboto !text-[24px] !leading-[1.5] text-justify text-white">
                    {article.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {isExpanded && (
            <div className={["fx-curtainDown", curtainOpen ? "is-open" : ""].join(" ")}>
              <div className="flex flex-col !gap-[60px] mt-[60px]">
                {extra.map((article) => (
                  <article
                    key={article.id}
                    className="flex items-center !gap-[30px] max-[1200px]:flex-col max-[1200px]:items-start"
                  >
                    <div className="shrink-0">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="block object-cover !w-[599px] !h-[365px] filter grayscale max-[1200px]:!w-full max-[1200px]:!h-auto"
                      />
                    </div>

                    <div className="flex flex-col items-start !max-w-[552px] max-[1200px]:max-w-full max-[1200px]:pt-5">
                      <p className="font-roboto italic !font-extralight !text-[26px] text-white !leading-[1] !mt-0 !-mb-[40px]">
                        {article.date}
                      </p>

                      <h3 className="font-bebas !font-normal !text-[64px] text-white !leading-[1] text-shadow-article !mt-0 !-mb-[10px]">
                        {article.title}
                      </h3>

                      <p className="font-roboto !text-[24px] !leading-[1.5] text-justify text-white !mt-0">
                        {article.desc}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {extra.length > 0 && (
            <div
              className={["rs__loadwrap", overlayVisible ? "" : "rs__loadwrap--hidden"].join(" ")}
              aria-hidden={!overlayVisible}
            >
              {!isExpanded && (
                <button type="button" onClick={handleLoadMore} className="rs__loadbtn">
                  LOAD MORE...
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}