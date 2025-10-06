// src/features/ideas-tradition/components/ArticlesSection.tsx
import { type FC, useMemo, useState } from "react";
import { articles as dataArticles } from "@/data/articles";

type ArticleCardVM = {
  id: string | number;
  title: string;
  dateLabel: string;
  imageUrl: string;
};

function formatDateISOToDisplay(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";

  const dd = String(d.getDate()).padStart(2, "0");
  const mon = d.toLocaleString("en-US", { month: "short" });
  const yyyy = d.getFullYear();
  return `${dd} ${mon}, ${yyyy}`;
}

const ArticleCardItem: FC<ArticleCardVM> = ({ title, dateLabel, imageUrl }) => {
  return (
    <article className="group cursor-pointer text-center">
      <div
        className={[
          "w-full h-[470px] mb-[10px]",
          "bg-black bg-cover bg-center bg-blend-luminosity",
          "transition-transform duration-[400ms] ease-in-out group-hover:scale-[1.03]",
          "transition-[filter] group-hover:saturate-[1.2]",
          "max-[768px]:h-[400px]",
        ].join(" ")}
        style={{ backgroundImage: `url(${imageUrl})` }}
        aria-label={title}
      />

      <div className="flex flex-col items-center">
        <p
          className="mb-[-23px] text-[15px] leading-[18px] text-[#B3B3B3] font-light font-['Roboto',sans-serif]"
        >
          {dateLabel}
        </p>
        <h3
          className="text-white font-normal text-[48px] leading-[1.1] max-[768px]:text-[38px] font-['Bebas Neue',cursive]"
        >
          {title}
        </h3>
      </div>
    </article>
  );
};

const ArticleSection: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const itArticles: ArticleCardVM[] = useMemo(
    () =>
      dataArticles
        .filter((a) => a.section === "ideas-tradition")
        .map((a) => ({
          id: a.id,
          title: a.title,
          dateLabel: formatDateISOToDisplay(a.publishedAt),
          imageUrl: a.image ?? a.cover,
        })),
    []
  );

    return (
    <section className="w-full bg-black py-[60px] text-white">
      <div className="mx-auto max-w-[1275px] px-[20px]">
        <div className="relative">
          <div
            className={[
              "grid grid-cols-3 gap-y-[80px] gap-x-[40px]",
              "max-h-[2250px] overflow-hidden transition-[max-height] duration-[800ms] ease-in-out",
              isExpanded ? "max-h-[10000px]" : "",
              "max-[992px]:grid-cols-2",
              "max-[768px]:grid-cols-1 max-[768px]:gap-y-[60px] max-[768px]:gap-x-0",
            ].join(" ")}
          >
            {itArticles.map((a) => (
              <ArticleCardItem
                key={a.id}
                id={a.id}
                title={a.title}
                dateLabel={a.dateLabel}
                imageUrl={a.imageUrl}
              />
            ))}
          </div>

          {!isExpanded && itArticles.length > 0 && (
            <div
              className="pointer-events-none absolute bottom-0 left-0 z-[5] flex h-[200px] w-full items-center justify-center"
              style={{
                background:
                  "linear-gradient(0deg, #000000 16.35%, rgba(0, 0, 0, 0) 100%)",
              }}
            >
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="pointer-events-auto cursor-pointer border-0 bg-transparent transition-opacity duration-300"
                style={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontWeight: 400,
                  fontSize: "42px",
                  lineHeight: "48px",
                  letterSpacing: "0.05em",
                  color: "#FFFFFF",
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
};

export default ArticleSection;
export { ArticleSection as IdeasTraditionArticlesSection };