// // src/features/pop-cultures/components/PopCultureReviewHighlightSection.tsx
// import { useMemo, useState, useEffect, type CSSProperties } from "react";
// import { articles as dataArticles } from "@/data/articles";

// type ArticleCard = {
//   id: number | string;
//   title: string;
//   description: string;
//   image: string;
// };

// type Props = {
//   articles?: ArticleCard[];
//   title?: string;
//   heroImageUrl?: string;
//   initialIndex?: number;
// };

// export default function PopCultureReviewHighlightSection({
//   articles,
//   title = "POP-CULTURE REVIEW",
//   heroImageUrl = "/assets/popCulture/dadasdfe.png",
//   initialIndex = 2,
// }: Props) {
//   const itemsFromStore: ArticleCard[] = useMemo(
//     () =>
//       dataArticles
//         .filter((a) => a.section === "pop-cultures" && a.category === "Highlight")
//         .map((a) => ({
//           id: a.id,
//           title: a.title,
//           description: a.excerpt,
//           image: a.image ?? a.cover,
//         })),
//     []
//   );

//   const items = (articles?.length ? articles : itemsFromStore) as ArticleCard[];
//   if (!items.length) return null;

//   const [currentIndex, setCurrentIndex] = useState(
//     Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0))
//   );
//   useEffect(() => {
//     setCurrentIndex((prev) => (items.length ? Math.min(prev, items.length - 1) : 0));
//   }, [items.length]);

//   const sliderVars: CSSProperties = { ["--current-index" as any]: currentIndex };

//   const goPrev = () => setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
//   const goNext = () =>
//     setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));

//   return (
//     <div className="pc-review-highlight-wrapper">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');

//         .pc__bebas { font-family: 'Bebas Neue', cursive !important; }
//         .pc__roboto { font-family: 'Roboto', sans-serif !important; }

//         .pc__heroTitle { font-size: 5rem !important; }

//         .pcr__nav{
//           position:absolute !important; top:50% !important; transform:translateY(-50%) !important; z-index:10 !important;
//           display:flex !important; align-items:center !important; justify-content:center !important;
//           width:60px !important; height:60px !important; border-radius:9999px !important;
//           border:2px solid rgba(255,255,255,0.3) !important; background:rgba(255,255,255,0.1) !important;
//           color:#ffffff !important; font-size:1.5rem !important; line-height:1 !important;
//           transition:transform .2s ease, background-color .2s ease !important;
//         }
//         .pcr__nav:hover{ transform:translateY(-50%) scale(1.10) !important; background:rgba(255,255,255,0.2) !important; }
//         .pcr__nav--left{ left:40px !important; }
//         .pcr__nav--right{ right:40px !important; }
//         @media (max-width: 768px){
//           .pcr__nav{ width:45px !important; height:45px !important; font-size:1.2rem !important; }
//           .pcr__nav--left{ left:0.5rem !important; }
//           .pcr__nav--right{ right:0.5rem !important; }
//         }

//         .pc-review-slider {
//           --card-w: 1029px;
//           --card-gap: 30px;
//           transform: translateX(
//             calc(50% - (var(--card-w) / 2) - (var(--current-index) * (var(--card-w) + var(--card-gap))))
//           ) !important;
//         }

//         @media (max-width: 1200px) {
//           .pc-review-slider { --card-w: 90vw; --card-gap: 20px; }
//         }
//         @media (max-width: 768px) {
//           .pc-review-slider { --card-w: 95vw; --card-gap: 15px; }
//         }
//       `}</style>

//       <section
//         aria-label="Pop-culture highlight hero"
//         className="relative w-screen h-[60vh] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-black bg-cover bg-center flex items-center justify-center"
//         style={{ backgroundImage: `url('${heroImageUrl}')`, backgroundBlendMode: "luminosity" }}
//       >
//         <div
//           aria-hidden
//           className="absolute inset-0 z-[1]"
//           style={{
//             background:
//               "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 20%, transparent 100%)",
//           }}
//         />
//         <h1 className="pc__bebas pc__heroTitle relative z-[2] uppercase text-center text-white">
//           {title}
//         </h1>
//       </section>

//       <section className="relative w-full py-5 bg-black overflow-hidden mt-38">
//         <div
//           aria-hidden
//           className="pointer-events-none absolute left-0 top-0 bottom-0 z-[3]"
//           style={{ width: "15%", maxWidth: 200, background: "linear-gradient(to right, #000 30%, transparent 100%)" }}
//         />
//         <div
//           aria-hidden
//           className="pointer-events-none absolute right-0 top-0 bottom-0 z-[3]"
//           style={{ width: "15%", maxWidth: 200, background: "linear-gradient(to left, #000 30%, transparent 100%)" }}
//         />

//         <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
//           <button
//             type="button"
//             aria-label="Previous article"
//             onClick={goPrev}
//             className="pcr__nav pcr__nav--left"
//           >
//             &#8249;
//           </button>

//           <div className="relative h-[417px] w-full overflow-visible">
//             <div
//               className="pc-review-slider flex h-full items-center gap-[30px] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
//               style={sliderVars}
//             >
//               {items.map((article, idx) => {
//                 const isActive = idx === currentIndex;
//                 return (
//                   <article
//                     key={article.id}
//                     className={[
//                       "relative shrink-0 cursor-pointer overflow-hidden bg-[#111] transition-all duration-300",
//                       "!w-[1029px] !h-[417px]",
//                       "max-[1200px]:!w-[90vw] max-[1200px]:!h-[350px]",
//                       "max-[768px]:!w-[95vw] max-[768px]:!h-[300px]",
//                       isActive ? "!opacity-100 !scale-100" : "!opacity-50 !scale-95",
//                       "hover:!scale-[1.02] hover:!opacity-100 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
//                     ].join(" ")}
//                     onClick={() => setCurrentIndex(idx)}
//                   >
//                     <img
//                       src={article.image}
//                       alt={article.title}
//                       loading="lazy"
//                       className="h-full w-full object-cover transition-[filter] duration-300 filter grayscale hover:grayscale-0"
//                     />

//                     <div
//                       className="absolute inset-0 flex flex-col items-start justify-start p-[30px] pr-[40px] text-white"
//                       style={{
//                         background:
//                           "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
//                       }}
//                     >
//                       <h3 className="pc__bebas uppercase !text-[3.5rem] !font-normal !leading-[1] tracking-[2px] max-w-[500px] mb-[10px]">
//                         {article.title}
//                       </h3>
//                       <p className="pc__roboto text-left !text-[1rem] leading-[1.6] opacity-90 max-w-[450px]">
//                         {article.description}
//                       </p>
//                     </div>
//                   </article>
//                 );
//               })}
//             </div>
//           </div>

//           <button
//             type="button"
//             aria-label="Next article"
//             onClick={goNext}
//             className="pcr__nav pcr__nav--right"
//           >
//             &#8250;
//           </button>
//         </div>
//       </section>
//     </div>
//   );
// }


// src/features/pop-cultures/components/PopCultureReviewHighlightSection.tsx
import { useMemo, useState, useEffect, type CSSProperties } from "react";
import { useHybridArticles } from "@/features/articles/hooks";

type ArticleCard = {
  id: number | string;
  title: string;
  description: string;
  image: string;
};

type Props = {
  articles?: ArticleCard[];
  title?: string;
  heroImageUrl?: string;
  initialIndex?: number;
};

export default function PopCultureReviewHighlightSection({
  articles,
  title = "POP-CULTURE REVIEW",
  heroImageUrl = "/assets/popCulture/dadasdfe.png",
  initialIndex = 2,
}: Props) {
  const { articles: hybrid } = useHybridArticles();

  const itemsFromStore: ArticleCard[] = useMemo(
    () =>
      (hybrid as any[])
        .filter((a) => a.section === "pop-cultures" && a.category === "Highlight")
        .map((a) => ({
          id: a.id,
          title: a.title,
          description: a.excerpt,
          image: a.image ?? a.cover,
        })),
    [hybrid]
  );

  const items = (articles?.length ? articles : itemsFromStore) as ArticleCard[];
  if (!items.length) return null;

  const [currentIndex, setCurrentIndex] = useState(
    Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0))
  );
  useEffect(() => {
    setCurrentIndex((prev) => (items.length ? Math.min(prev, items.length - 1) : 0));
  }, [items.length]);

  const sliderVars: CSSProperties = { ["--current-index" as any]: currentIndex };

  const goPrev = () => setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  const goNext = () =>
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  return (
    <div className="pc-review-highlight-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');

        .pc__bebas { font-family: 'Bebas Neue', cursive !important; }
        .pc__roboto { font-family: 'Roboto', sans-serif !important; }

        .pc__heroTitle { font-size: 5rem !important; }

        .pcr__nav{
          position:absolute !important; top:50% !important; transform:translateY(-50%) !important; z-index:10 !important;
          display:flex !important; align-items:center !important; justify-content:center !important;
          width:60px !important; height:60px !important; border-radius:9999px !important;
          border:2px solid rgba(255,255,255,0.3) !important; background:rgba(255,255,255,0.1) !important;
          color:#ffffff !important; font-size:1.5rem !important; line-height:1 !important;
          transition:transform .2s ease, background-color .2s ease !important;
        }
        .pcr__nav:hover{ transform:translateY(-50%) scale(1.10) !important; background:rgba(255,255,255,0.2) !important; }
        .pcr__nav--left{ left:40px !important; }
        .pcr__nav--right{ right:40px !important; }
        @media (max-width: 768px){
          .pcr__nav{ width:45px !important; height:45px !important; font-size:1.2rem !important; }
          .pcr__nav--left{ left:0.5rem !important; }
          .pcr__nav--right{ right:0.5rem !important; }
        }

        .pc-review-slider {
          --card-w: 1029px;
          --card-gap: 30px;
          transform: translateX(
            calc(50% - (var(--card-w) / 2) - (var(--current-index) * (var(--card-w) + var(--card-gap))))
          ) !important;
        }

        @media (max-width: 1200px) {
          .pc-review-slider { --card-w: 90vw; --card-gap: 20px; }
        }
        @media (max-width: 768px) {
          .pc-review-slider { --card-w: 95vw; --card-gap: 15px; }
        }
      `}</style>

      <section
        aria-label="Pop-culture highlight hero"
        className="relative w-screen h-[60vh] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-black bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url('${heroImageUrl}')`, backgroundBlendMode: "luminosity" }}
      >
        <div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 20%, transparent 100%)",
          }}
        />
        <h1 className="pc__bebas pc__heroTitle relative z-[2] uppercase text-center text-white">
          {title}
        </h1>
      </section>

      <section className="relative w-full py-5 bg-black overflow-hidden mt-38">
        <div aria-hidden className="pointer-events-none absolute left-0 top-0 bottom-0 z-[3]" style={{ width: "15%", maxWidth: 200, background: "linear-gradient(to right, #000 30%, transparent 100%)" }} />
        <div aria-hidden className="pointer-events-none absolute right-0 top-0 bottom-0 z-[3]" style={{ width: "15%", maxWidth: 200, background: "linear-gradient(to left, #000 30%, transparent 100%)" }} />

        <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
          <button type="button" aria-label="Previous article" onClick={goPrev} className="pcr__nav pcr__nav--left">
            &#8249;
          </button>

          <div className="relative h-[417px] w-full overflow-visible">
            <div className="pc-review-slider flex h-full items-center gap-[30px] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" style={sliderVars as any}>
              {items.map((article, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <article
                    key={article.id}
                    className={[
                      "relative shrink-0 cursor-pointer overflow-hidden bg-[#111] transition-all duration-300",
                      "!w-[1029px] !h-[417px]",
                      "max-[1200px]:!w-[90vw] max-[1200px]:!h-[350px]",
                      "max-[768px]:!w-[95vw] max-[768px]:!h-[300px]",
                      isActive ? "!opacity-100 !scale-100" : "!opacity-50 !scale-95",
                      "hover:!scale-[1.02] hover:!opacity-100 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
                    ].join(" ")}
                    onClick={() => setCurrentIndex(idx)}
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-[filter] duration-300 filter grayscale hover:grayscale-0"
                    />

                    <div
                      className="absolute inset-0 flex flex-col items-start justify-start p-[30px] pr-[40px] text-white"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
                      }}
                    >
                      <h3 className="pc__bebas uppercase !text-[3.5rem] !font-normal !leading-[1] tracking-[2px] max-w-[500px] mb-[10px]">
                        {article.title}
                      </h3>
                      <p className="pc__roboto text-left !text-[1rem] leading-[1.6] opacity-90 max-w-[450px]">
                        {article.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <button type="button" aria-label="Next article" onClick={goNext} className="pcr__nav pcr__nav--right">
            &#8250;
          </button>
        </div>
      </section>
    </div>
  );
}