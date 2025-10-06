// src/features/magazine/components/MagazineCollectionSection.tsx
import { useMemo, useState } from "react";
import { articles as dataArticles } from "@/data/articles";

type ArticleCard = {
  id: string | number;
  title: string;
  author: string;
  description: string;
  image: string;
};

export default function MagazineCollectionSection() {
  const magazineArticles: ArticleCard[] = useMemo(
    () =>
      dataArticles
        .filter((a) => a.section === "magazine" && a.category === "Collection")
        .map((a) => ({
          id: a.id,
          title: a.title,
          author: a.author?.name ?? "Unknown",
          description: a.excerpt,
          image: a.image ?? a.cover,
        })),
    []
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const visible = isExpanded ? magazineArticles : magazineArticles.slice(0, 4);

  return (
    <section className="w-full overflow-hidden bg-black px-8 py-16">
      <div className="relative mx-auto max-w-[1307px] pb-[120px]">
        <h2 className='mb-16 text-left font-["Bebas Neue"] text-[68px] font-normal text-white'>
          PREVIOUS MAGAZINE
        </h2>

        <div className="flex flex-col gap-20">
          {visible.length === 0 && (
            <p className='font-["Roboto"] text-white/80'>
              Belum ada artikel di kategori ini.
            </p>
          )}

          {visible.map((a, idx) => {
            const isOddRow = idx % 2 === 0;
            return (
              <article
                key={a.id}
                className={[
                  "relative flex items-center",
                  "lg:h-[425px]",
                  isOddRow ? "lg:justify-start" : "lg:justify-end",
                  "flex-col lg:flex-row",
                ].join(" ")}
              >
                <div className="relative h-[300px] w-full overflow-hidden rounded-[20px] lg:h-full lg:w-[60%]">
                  <img
                    src={a.image}
                    alt={a.title}
                    className="h-full w-full rounded-[20px] object-cover grayscale"
                    loading="lazy"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[20px] bg-black/40"
                  />
                </div>

                <div
                  className={[
                    "relative z-[2] mt-[-2rem] w-full rounded-[20px] bg-[#171717] p-8 text-white",
                    "lg:absolute lg:top-1/2 lg:h-[60%] lg:w-[65%] lg:-translate-y-1/2 lg:bg-transparent lg:p-16",
                    isOddRow ? "lg:right-0" : "lg:left-0",
                    "overflow-hidden",
                  ].join(" ")}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 hidden rounded-[20px] lg:block"
                    style={{
                      background: isOddRow
                        ? "linear-gradient(to left, #171717 75.85%, rgba(23,23,23,0) 99.96%)"
                        : "linear-gradient(to right, #171717 75.85%, rgba(23,23,23,0) 99.96%)",
                    }}
                  />

                  <h3 className='relative z-[1] mb-2 font-["Bebas Neue"] text-[42px] font-normal leading-tight text-white drop-shadow-[0_4px_50px_rgba(0,0,0,0.25)]'>
                    {a.title}
                  </h3>
                  <p className='relative z-[1] mb-4 font-["Roboto"] text-base font-light leading-6 text-white'>
                    By {a.author}
                  </p>
                  <p className='relative z-[1] font-["Roboto"] text-base font-normal leading-6 text-white text-justify'>
                    {a.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {!isExpanded && magazineArticles.length > 4 && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[150px] items-end justify-center pb-8"
            style={{
              background:
                "linear-gradient(0deg, #000000 16.35%, rgba(0, 0, 0, 0) 100%)",
            }}
          >
            <button
              type="button"
              aria-label="Load more magazine articles"
              className='pointer-events-auto font-["Bebas Neue"] text-[42px] font-normal tracking-wider text-white transition-opacity hover:opacity-80'
              onClick={() => setIsExpanded(true)}
            >
              LOAD MORE...
            </button>
          </div>
        )}
      </div>
    </section>
  );
}