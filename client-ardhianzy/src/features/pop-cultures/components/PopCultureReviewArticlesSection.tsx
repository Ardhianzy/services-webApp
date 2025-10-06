// src/features/pop-culture/components/PopCultureReviewArticlesSection.tsx
import { useMemo, useState } from "react";
import { articles as dataArticles } from "@/data/articles";

type ArticleCard = {
  id: string | number;
  title: string;
  date: string;
  image: string;
};

type Props = {
  articles?: ArticleCard[];
};

const MAX_COLLAPSED_HEIGHT = 2250;
const EXPANDED_MAX_HEIGHT = 10000;

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  const month = d.toLocaleString("en-US", { month: "long" });
  return `${d.getDate()} ${month}, ${d.getFullYear()}`;
}

export default function PopCultureReviewArticlesSection({ articles }: Props) {
  const itemsFromCenter: ArticleCard[] = useMemo(
    () =>
      dataArticles
        .filter((a) => a.section === "pop-cultures" && a.category === "Review")
        .map((a) => ({
          id: a.id,
          title: a.title,
          date: formatDate(a.publishedAt),
          image: a.image ?? a.cover,
        })),
    []
  );

  const source = (articles?.length ? articles : itemsFromCenter) as ArticleCard[];
  const [isExpanded, setIsExpanded] = useState(false);

  if (!source.length) return null;

  return (
    <section className="w-full bg-black text-white py-[60px]">
      <div className="mx-auto max-w-[1275px] px-5">
        <div className="relative">
          <div
            className={[
              "pc-grid grid",
              !isExpanded && "overflow-hidden",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              maxHeight: isExpanded ? EXPANDED_MAX_HEIGHT : MAX_COLLAPSED_HEIGHT,
              transition: "max-height 0.8s ease-in-out",
            }}
          >
            {source.map((article) => (
              <article key={article.id} className="pc-card text-center cursor-pointer">
                <div
                  className="pc-img w-full h-[470px] bg-cover bg-center bg-black mb-[10px]"
                  style={{
                    backgroundImage: `url(${article.image})`,
                    backgroundBlendMode: "luminosity",
                  }}
                  aria-label={article.title}
                />
                <div className="flex flex-col items-center">
                  <p
                    className="text-[#B3B3B3] mb-[-23px]"
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 300,
                      fontSize: "15px",
                      lineHeight: "18px",
                    }}
                  >
                    {article.date}
                  </p>
                  <h3
                    className="pc-title"
                    style={{
                      fontFamily: '"Bebas Neue", cursive',
                      fontWeight: 400,
                      fontSize: "48px",
                      lineHeight: 1.1,
                      textShadow: "0px 4px 50px rgba(0,0,0,0.25)",
                    }}
                  >
                    {article.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>

          {!isExpanded && (
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 z-[5] flex h-[200px] w-full items-center justify-center"
              style={{
                background:
                  "linear-gradient(0deg, #000000 16.35%, rgba(0, 0, 0, 0) 100%)",
              }}
            >
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="pointer-events-auto"
                style={{
                  fontFamily: '"Bebas Neue", cursive',
                  fontWeight: 400,
                  fontSize: "42px",
                  lineHeight: "48px",
                  letterSpacing: "0.05em",
                  color: "#FFFFFF",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.3s ease",
                }}
              >
                LOAD MORE...
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* Grid dasar: 3 kolom, gap 80px (y) / 40px (x) */
        .pc-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 80px 40px;
        }

        /* Hover scale + saturate (durasi 0.4s seperti CSS lama) */
        .pc-card .pc-img { transition: transform .4s ease, filter .4s ease; }
        .pc-card:hover .pc-img { transform: scale(1.03); filter: saturate(1.2); }

        /* <=992px → 2 kolom */
        @media (max-width: 992px) {
          .pc-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* <=768px → 1 kolom, gap 60px 0; tinggi gambar 400px; judul 38px */
        @media (max-width: 768px) {
          .pc-grid { grid-template-columns: 1fr; gap: 60px 0; }
          .pc-img { height: 400px; }
          .pc-title { font-size: 38px; }
        }
      `}</style>
    </section>
  );
}