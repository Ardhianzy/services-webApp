// src/features/research/components/ResearchArticlesSection.tsx
import { useState, useMemo } from "react";
import { articles as allArticles } from "@/data/articles";

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

function formatPrettyDate(iso: string) {
  const d = new Date(iso);
  const month = d.toLocaleString("en-US", { month: "long" });
  return `${month} ${d.getDate()}, ${d.getFullYear()}`;
}

export default function ResearchArticlesSection({ articles }: Props) {
  const articlesFromStore: ResearchArticle[] = useMemo(
    () =>
      allArticles
        .filter((a) => a.section === "research" && a.category !== "Highlight")
        .map((a) => ({
          id: a.id,
          date: formatPrettyDate(a.publishedAt),
          title: a.title,
          desc: a.excerpt,
          image: a.image ?? a.cover,
        })),
    []
  );

  const articlesToRender = (articles && articles.length > 0) ? articles : articlesFromStore;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="w-full bg-black text-white py-20">
      <div className="max-w-[1331px] mx-auto px-5">
        <h2
          className="mb-10 border-t border-white pt-5 text-left"
          style={{
            fontFamily: '"Bebas Neue", cursive',
            fontWeight: 400,
            fontSize: 48,
            lineHeight: "58px",
          }}
        >
          LATEST RESEARCH
        </h2>

        <div className="relative">
          <div
            className="flex flex-col gap-[60px] overflow-hidden transition-[max-height] duration-700 ease-in-out"
            style={{ maxHeight: isExpanded ? "5000px" : "1350px" }}
          >
            {articlesToRender.map((article) => (
              <article
                key={article.id}
                className="flex items-center gap-[30px] max-[1200px]:flex-col max-[1200px]:items-start"
              >
                <div className="shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="block object-cover w-[599px] h-[365px] filter grayscale max-[1200px]:w-full max-[1200px]:h-auto"
                  />
                </div>

                <div className="flex flex-col items-start max-w-[552px] max-[1200px]:max-w-full max-[1200px]:pt-5">
                  <p
                    className="mb-0"
                    style={{
                      fontFamily: '"Roboto", sans-serif',
                      fontStyle: "italic",
                      fontWeight: 200,
                      fontSize: 26,
                      lineHeight: 1,
                      marginBottom: -40,
                    }}
                  >
                    {article.date}
                  </p>

                  <h3
                    className="mb-0"
                    style={{
                      fontFamily: '"Bebas Neue", cursive',
                      fontWeight: 400,
                      fontSize: 64,
                      lineHeight: 1,
                      color: "#FFFFFF",
                      textShadow: "0px 4px 50px rgba(0,0,0,0.25)",
                      marginBottom: -10,
                    }}
                  >
                    {article.title}
                  </h3>

                  <p
                    className="text-justify"
                    style={{
                      fontFamily: '"Roboto", sans-serif',
                      fontWeight: 400,
                      fontSize: 24,
                      lineHeight: 1.5,
                      color: "#FFFFFF",
                    }}
                  >
                    {article.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {!isExpanded && (
            <div
              className="absolute left-0 bottom-0 w-full h-20 flex items-center justify-center z-[5]"
              style={{
                background:
                  "linear-gradient(0deg, #000000 16.35%, rgba(0,0,0,0) 100%)",
              }}
            >
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="transition-opacity hover:opacity-80"
                style={{
                  fontFamily: '"Bebas Neue", cursive',
                  fontWeight: 400,
                  fontSize: 42,
                  lineHeight: "48px",
                  letterSpacing: "0.05em",
                  color: "#FFFFFF",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                LOAD MORE...
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}