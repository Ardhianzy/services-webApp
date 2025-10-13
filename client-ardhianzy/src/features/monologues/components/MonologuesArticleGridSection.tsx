// src/features/monologues/components/MonologuesArticleGridSection.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useHybridArticles } from "@/features/articles/hooks";

type ArticleCard = {
  id: string | number;
  title: string;
  date: string;
  category: string;
  image: string;
  excerpt: string;
};

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "—";
  const months = [
    "January","February","March","April","May","June","July","August","September","October","November","December",
  ];
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
}

function truncate(s: string, n = 100): string {
  if (!s) return "";
  return s.length <= n ? s : `${s.slice(0, n).trim()}...`;
}

export default function MonologuesArticleGridSection() {
  const { articles: hybrid } = useHybridArticles();

  const monologueArticles: ArticleCard[] = useMemo(
    () =>
      (hybrid as any[])
        .filter((a) => a.section === "monologues" && a.category === "Monologues")
        .map((a) => ({
          id: a.id,
          slug: a.slug,
          title: a.title,
          date: formatDate(a.publishedAt),
          category: a.category ?? "Monologues",
          image: a.image ?? a.cover,
          excerpt: a.excerpt ?? "",
        })),
    [hybrid]
  );

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="w-full bg-black text-white py-[60px]">
      <style>{`
        .mono__bebas { font-family: 'Bebas Neue', cursive !important; }
        .mono__roboto { font-family: 'Roboto', sans-serif !important; }
        .mono__shadow { text-shadow: 0px 4px 50px rgba(0,0,0,0.25) !important; }
      `}</style>

      <div className="mx-auto max-w-[1331px] px-5 mt-15">
        <h2 className="mb-10 border-t border-white pt-5 text-left mono__bebas !text-[48px] !leading-[58px] !font-normal">
          Latest Monologues
        </h2>

        <div className="relative">
          <div
            className={[
              "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
              "!gap-x-[30px] !gap-y-[60px]",
              "overflow-hidden transition-[max-height] duration-700 ease-in-out",
            ].join(" ")}
            style={{ maxHeight: isExpanded ? 10000 : 2350 }}
          >
            {monologueArticles.map((article) => (
              <Link
                to={`/read/${(article as any).slug ?? article.id}`}
                key={article.id}
                className="block text-inherit no-underline"
                aria-label={article.title}
              >
                <article className="text-center transition-transform duration-300 hover:-translate-y-2">
                  <div
                    className="!h-[219px] w-full bg-black bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${article.image})`,
                      backgroundBlendMode: "luminosity",
                    }}
                    aria-hidden
                  />
                  <div className="!mt-5 flex flex-col items-center">
                    <p className="!-mb-5 mono__roboto !text-[15px] !leading-[18px] !font-light text-[#B3B3B3]">
                      {article.date}
                    </p>

                    <div className="relative !-mb-[45px] flex items-center justify-center py-[5px]">
                      <div
                        aria-hidden
                        className="absolute z-[1] rounded-full blur-[8px]"
                        style={{
                          width: "110%",
                          height: 80,
                          background: "rgba(255,255,255,0.05)",
                        }}
                      />
                      <h3 className="relative my-12 z-[2] mono__bebas mono__shadow !text-[48px] !leading-[1.1] !font-normal text-white">
                        {article.title}
                      </h3>
                    </div>

                    <p className="max-w-[353px] mt-5 mono__roboto !text-[20px] !leading-[1.2] text-white">
                      {truncate(article.excerpt, 100)}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {!isExpanded && monologueArticles.length > 15 && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 flex h-20 items-center justify-center"
              style={{
                background:
                  "linear-gradient(0deg, #000000 16.35%, rgba(0,0,0,0) 100%)",
              }}
            >
              <button
                className='pointer-events-auto cursor-pointer border-0 bg-transparent mono__bebas text-[42px] leading-[48px] tracking-[0.05em] text-white transition-opacity hover:opacity-80'
                onClick={() => setIsExpanded(true)}
                aria-label="Load more monologues"
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