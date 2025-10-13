// // src/features/ideas-tradition/components/HighlightSection.tsx
// import { useEffect, useMemo, useState, type FC } from "react";
// import { articles as dataArticles } from "@/data/articles";

// type ArticleCard = {
//   id: string | number;
//   title: string;
//   description: string;
//   image: string;
// };

// const BG_IMAGE = "/assets/ideas&tradition/Groupkdfk.png";
// const LEFT_GRADIENT = "linear-gradient(to right, #000 30%, transparent 100%)";
// const RIGHT_GRADIENT = "linear-gradient(to left, #000 30%, transparent 100%)";
// const CARD_OVERLAY =
//   "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)";

// function getCardMetrics(vw: number) {
//   if (vw <= 768) {
//     return {
//       width: "95vw",
//       heightClass: "!h-[300px]",
//       gapPx: 15,
//       titleSizeRem: 2.5,
//       bodySizeRem: 0.9,
//       padding: "20px 25px",
//     };
//   }
//   if (vw <= 1200) {
//     return {
//       width: "90vw",
//       heightClass: "!h-[350px]",
//       gapPx: 20,
//       titleSizeRem: 3.0,
//       bodySizeRem: 1.0,
//       padding: "30px 40px",
//     };
//   }
//   return {
//     width: "1029px",
//     heightClass: "!h-[417px]",
//     gapPx: 30,
//     titleSizeRem: 3.5,
//     bodySizeRem: 1.0,
//     padding: "30px 40px",
//   };
// }

// const IdeasTraditionHero: FC = () => (
//   <section
//     className={[
//       "relative left-1/2 -translate-x-1/2 w-screen",
//       "!h-[60vh] !bg-black bg-cover bg-center !bg-blend-luminosity",
//       "flex items-center justify-center",
//     ].join(" ")}
//     style={{ backgroundImage: `url('${BG_IMAGE}')` }}
//   >
//     <div
//       className="absolute inset-0 z-[1]"
//       style={{
//         background:
//           "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, transparent 100%)",
//       }}
//     />
//     <h1 className="it__heroTitle relative z-[2] text-white text-center uppercase">
//       IDEAS & TRADITION
//     </h1>
//   </section>
// );

// const ArrowButton: FC<{
//   side: "left" | "right";
//   label: string;
//   onClick: () => void;
// }> = ({ side, label, onClick }) => (
//   <button
//     type="button"
//     aria-label={label}
//     onClick={onClick}
//     onMouseDown={(e) => e.preventDefault()}
//     className={["it__nav", side === "left" ? "it__nav--left" : "it__nav--right"].join(" ")}
//   >
//     {side === "left" ? "\u2039" : "\u203A"}
//   </button>
// );

// const HighlightCard: FC<{
//   data: ArticleCard;
//   active: boolean;
//   heightClass: string;
//   titleSizeRem: number;
//   bodySizeRem: number;
//   padding: string;
// }> = ({ data, active, heightClass, titleSizeRem, bodySizeRem, padding }) => (
//   <article
//     aria-current={active ? "true" : undefined}
//     className={[
//       "group relative mt-14 overflow-hidden cursor-pointer !bg-[#111111]",
//       "flex-shrink-0 w-[min(1029px,95vw)]",
//       heightClass,
//       "transition duration-400 ease-in-out",
//       "scale-[0.85] opacity-50",
//       "hover:scale-[1.02] hover:opacity-100 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
//       active ? "!scale-100 !opacity-100" : "",
//     ].join(" ")}
//   >
//     <img
//       src={data.image}
//       alt={data.title}
//       loading="lazy"
//       className="w-full h-full object-cover grayscale transition duration-300 ease-in-out group-hover:grayscale-0"
//     />
//     <div
//       className="absolute inset-0 text-white flex flex-col justify-start items-start"
//       style={{ background: CARD_OVERLAY, padding }}
//     >
//       <h3
//         className="it__bebas uppercase !mb-[10px]"
//         style={{
//           fontWeight: 400,
//           fontSize: `${titleSizeRem}rem`,
//           lineHeight: 1,
//           letterSpacing: "2px",
//           maxWidth: 500,
//         }}
//       >
//         {data.title}
//       </h3>
//       <p
//         className="it__roboto opacity-90 !mt-4"
//         style={{
//           fontWeight: 400,
//           fontSize: `${bodySizeRem}rem`,
//           lineHeight: 1.6,
//           maxWidth: 450,
//           textAlign: "left",
//         }}
//       >
//         {data.description}
//       </p>
//     </div>
//   </article>
// );

// const IdeasTraditionHighlightSection: FC = () => {
//   const [vw, setVw] = useState<number>(() =>
//     typeof window !== "undefined" ? window.innerWidth : 1920
//   );
//   useEffect(() => {
//     const onResize = () => setVw(window.innerWidth);
//     window.addEventListener("resize", onResize, { passive: true });
//     return () => window.removeEventListener("resize", onResize);
//   }, []);

//   const ITEMS: ArticleCard[] = useMemo(
//     () =>
//       dataArticles
//         .filter(
//           (a) => a.section === "ideas-tradition" && a.category === "Highlight"
//         )
//         .map((a) => ({
//           id: a.id,
//           title: a.title,
//           description: a.excerpt,
//           image: a.image ?? a.cover,
//         })),
//     []
//   );

//   const [currentIndex, setCurrentIndex] = useState<number>(2);
//   const safeIndex = ITEMS.length ? Math.min(currentIndex, ITEMS.length - 1) : 0;

//   const { width, heightClass, gapPx, titleSizeRem, bodySizeRem, padding } =
//     getCardMetrics(vw);

//   const sliderTransform = useMemo(() => {
//     return `translateX(calc(50% - (${width} / 2) - (${safeIndex} * (${width} + ${gapPx}px))))`;
//   }, [width, gapPx, safeIndex]);

//   const handlePrev = () =>
//     setCurrentIndex((prev) =>
//       prev === 0 ? Math.max(ITEMS.length - 1, 0) : prev - 1
//     );
//   const handleNext = () =>
//     setCurrentIndex((prev) =>
//       prev === Math.max(ITEMS.length - 1, 0) ? 0 : prev + 1
//     );

//   return (
//     <div className="relative">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');

//         .it__bebas { font-family: 'Bebas Neue', cursive !important; }
//         .it__roboto { font-family: 'Roboto', sans-serif !important; }

//         .it__heroTitle{ font-family:'Bebas Neue',cursive!important; font-size:5rem!important; }

//         .it__nav{
//           position:absolute !important;
//           top:50% !important;
//           transform:translateY(-50%) !important;
//           z-index:10 !important;

//           display:flex !important;
//           align-items:center !important;
//           justify-content:center !important;

//           width:60px !important;
//           height:60px !important;
//           border-radius:9999px !important; /* fully rounded */
//           border:2px solid rgba(255,255,255,0.3) !important;
//           background:rgba(255,255,255,0.1) !important;

//           color:#fff !important;
//           font-size:1.5rem !important;
//           line-height:1 !important;

//           transition:transform .2s ease, background-color .2s ease !important;
//         }
//         .it__nav:hover{
//           transform:translateY(-50%) scale(1.10) !important;
//           background:rgba(255,255,255,0.2) !important;
//         }
//         .it__nav--left{ left:40px !important; }
//         .it__nav--right{ right:40px !important; }

//         @media (max-width: 768px){
//           .it__nav{
//             width:45px !important;
//             height:45px !important;
//             font-size:1.2rem !important;
//           }
//           .it__nav--left{ left:0.5rem !important; }
//           .it__nav--right{ right:0.5rem !important; }
//         }
//       `}</style>

//       <IdeasTraditionHero />

//       <section
//         className="relative w-full !bg-black !py-[20px] overflow-hidden"
//         role="region"
//         aria-roledescription="carousel"
//         aria-label="Ideas & Tradition highlights"
//       >
//         <div
//           aria-hidden
//           className="pointer-events-none absolute inset-y-0 left-0 z-[3]"
//           style={{ width: "15%", maxWidth: 200, background: LEFT_GRADIENT }}
//         />
//         <div
//           aria-hidden
//           className="pointer-events-none absolute inset-y-0 right-0 z-[3]"
//           style={{ width: "15%", maxWidth: 200, background: RIGHT_GRADIENT }}
//         />

//         <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
//           {ITEMS.length > 1 && (
//             <ArrowButton side="left" label="Previous article" onClick={handlePrev} />
//           )}

//           <div className="relative w-full !h-[417px] overflow-visible">
//             <div
//               className="relative flex !h-full items-center transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
//               style={{ gap: `${gapPx}px`, transform: sliderTransform }}
//             >
//               {ITEMS.map((a, idx) => (
//                 <HighlightCard
//                   key={a.id}
//                   data={a}
//                   active={idx === safeIndex}
//                   heightClass={heightClass}
//                   titleSizeRem={titleSizeRem}
//                   bodySizeRem={bodySizeRem}
//                   padding={padding}
//                 />
//               ))}
//             </div>
//           </div>

//           {ITEMS.length > 1 && (
//             <ArrowButton side="right" label="Next article" onClick={handleNext} />
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default IdeasTraditionHighlightSection;
// export { IdeasTraditionHighlightSection as HighlightSection };


// src/features/ideas-tradition/components/HighlightSection.tsx
import { useEffect, useMemo, useState, type FC } from "react";
import { useHybridArticles } from "@/features/articles/hooks";

type ArticleCard = {
  id: string | number;
  title: string;
  description: string;
  image: string;
};

const BG_IMAGE = "/assets/ideas&tradition/Groupkdfk.png";
const LEFT_GRADIENT = "linear-gradient(to right, #000 30%, transparent 100%)";
const RIGHT_GRADIENT = "linear-gradient(to left, #000 30%, transparent 100%)";
const CARD_OVERLAY =
  "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)";

function getCardMetrics(vw: number) {
  if (vw <= 768) {
    return {
      width: "95vw",
      heightClass: "!h-[300px]",
      gapPx: 15,
      titleSizeRem: 2.5,
      bodySizeRem: 0.9,
      padding: "20px 25px",
    };
  }
  if (vw <= 1200) {
    return {
      width: "90vw",
      heightClass: "!h-[350px]",
      gapPx: 20,
      titleSizeRem: 3.0,
      bodySizeRem: 1.0,
      padding: "30px 40px",
    };
  }
  return {
    width: "1029px",
    heightClass: "!h-[417px]",
    gapPx: 30,
    titleSizeRem: 3.5,
    bodySizeRem: 1.0,
    padding: "30px 40px",
  };
}

const IdeasTraditionHero: FC = () => (
  <section
    className={[
      "relative left-1/2 -translate-x-1/2 w-screen",
      "!h-[60vh] !bg-black bg-cover bg-center !bg-blend-luminosity",
      "flex items-center justify-center",
    ].join(" ")}
    style={{ backgroundImage: `url('${BG_IMAGE}')` }}
  >
    <div
      className="absolute inset-0 z-[1]"
      style={{
        background:
          "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, transparent 100%)",
      }}
    />
    <h1 className="it__heroTitle relative z-[2] text-white text-center uppercase">
      IDEAS & TRADITION
    </h1>
  </section>
);

const ArrowButton: FC<{
  side: "left" | "right";
  label: string;
  onClick: () => void;
}> = ({ side, label, onClick }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    onMouseDown={(e) => e.preventDefault()}
    className={["it__nav", side === "left" ? "it__nav--left" : "it__nav--right"].join(" ")}
  >
    {side === "left" ? "\u2039" : "\u203A"}
  </button>
);

const HighlightCard: FC<{
  data: ArticleCard;
  active: boolean;
  heightClass: string;
  titleSizeRem: number;
  bodySizeRem: number;
  padding: string;
}> = ({ data, active, heightClass, titleSizeRem, bodySizeRem, padding }) => (
  <article
    aria-current={active ? "true" : undefined}
    className={[
      "group relative mt-14 overflow-hidden cursor-pointer !bg-[#111111]",
      "flex-shrink-0 w-[min(1029px,95vw)]",
      heightClass,
      "transition duration-400 ease-in-out",
      "scale-[0.85] opacity-50",
      "hover:scale-[1.02] hover:opacity-100 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]",
      active ? "!scale-100 !opacity-100" : "",
    ].join(" ")}
  >
    <img
      src={data.image}
      alt={data.title}
      loading="lazy"
      className="w-full h-full object-cover grayscale transition duration-300 ease-in-out group-hover:grayscale-0"
    />
    <div
      className="absolute inset-0 text-white flex flex-col justify-start items-start"
      style={{ background: CARD_OVERLAY, padding }}
    >
      <h3
        className="it__bebas uppercase !mb-[10px]"
        style={{
          fontWeight: 400,
          fontSize: `${titleSizeRem}rem`,
          lineHeight: 1,
          letterSpacing: "2px",
          maxWidth: 500,
        }}
      >
        {data.title}
      </h3>
      <p
        className="it__roboto opacity-90 !mt-4"
        style={{
          fontWeight: 400,
          fontSize: `${bodySizeRem}rem`,
          lineHeight: 1.6,
          maxWidth: 450,
          textAlign: "left",
        }}
      >
        {data.description}
      </p>
    </div>
  </article>
);

const IdeasTraditionHighlightSection: FC = () => {
  const { articles: hybrid } = useHybridArticles();
  const [vw, setVw] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1920
  );
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const ITEMS: ArticleCard[] = useMemo(
    () =>
      (hybrid as any[])
        .filter((a) => a.section === "ideas-tradition" && a.category === "Highlight")
        .map((a) => ({
          id: a.id,
          title: a.title,
          description: a.excerpt,
          image: a.image ?? a.cover,
        })),
    [hybrid]
  );

  const [currentIndex, setCurrentIndex] = useState<number>(2);
  const safeIndex = ITEMS.length ? Math.min(currentIndex, ITEMS.length - 1) : 0;

  const { width, heightClass, gapPx, titleSizeRem, bodySizeRem, padding } =
    getCardMetrics(vw);

  const sliderTransform = useMemo(() => {
    return `translateX(calc(50% - (${width} / 2) - (${safeIndex} * (${width} + ${gapPx}px))))`;
  }, [width, gapPx, safeIndex]);

  const handlePrev = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(ITEMS.length - 1, 0) : prev - 1
    );
  const handleNext = () =>
    setCurrentIndex((prev) =>
      prev === Math.max(ITEMS.length - 1, 0) ? 0 : prev + 1
    );

  return (
    <div className="relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap');

        .it__bebas { font-family: 'Bebas Neue', cursive !important; }
        .it__roboto { font-family: 'Roboto', sans-serif !important; }

        .it__heroTitle{ font-family:'Bebas Neue',cursive!important; font-size:5rem!important; }

        .it__nav{
          position:absolute !important;
          top:50% !important;
          transform:translateY(-50%) !important;
          z-index:10 !important;

          display:flex !important;
          align-items:center !important;
          justify-content:center !important;

          width:60px !important;
          height:60px !important;
          border-radius:9999px !important;
          border:2px solid rgba(255,255,255,0.3) !important;
          background:rgba(255,255,255,0.1) !important;

          color:#fff !important;
          font-size:1.5rem !important;
          line-height:1 !important;

          transition:transform .2s ease, background-color .2s ease !important;
        }
        .it__nav:hover{
          transform:translateY(-50%) scale(1.10) !important;
          background:rgba(255,255,255,0.2) !important;
        }
        .it__nav--left{ left:40px !important; }
        .it__nav--right{ right:40px !important; }

        @media (max-width: 768px){
          .it__nav{
            width:45px !important;
            height:45px !important;
            font-size:1.2rem !important;
          }
          .it__nav--left{ left:0.5rem !important; }
          .it__nav--right{ right:0.5rem !important; }
        }
      `}</style>

      <IdeasTraditionHero />

      <section
        className="relative w-full !bg-black !py-[20px] overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Ideas & Tradition highlights"
      >
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-[3]" style={{ width: "15%", maxWidth: 200, background: LEFT_GRADIENT }} />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-[3]" style={{ width: "15%", maxWidth: 200, background: RIGHT_GRADIENT }} />

        <div className="relative mx-auto flex w-full max-w-full items-center justify-center">
          {ITEMS.length > 1 && <ArrowButton side="left" label="Previous article" onClick={handlePrev} />}

          <div className="relative w-full !h-[417px] overflow-visible">
            <div
              className="relative flex !h-full items-center transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ gap: `${gapPx}px`, transform: sliderTransform }}
            >
              {ITEMS.map((a, idx) => (
                <HighlightCard
                  key={a.id}
                  data={a}
                  active={idx === safeIndex}
                  heightClass={heightClass}
                  titleSizeRem={titleSizeRem}
                  bodySizeRem={bodySizeRem}
                  padding={padding}
                />
              ))}
            </div>
          </div>

          {ITEMS.length > 1 && <ArrowButton side="right" label="Next article" onClick={handleNext} />}
        </div>
      </section>
    </div>
  );
};

export default IdeasTraditionHighlightSection;
export { IdeasTraditionHighlightSection as HighlightSection };