// // src/features/magazine/components/MagazineCollectionSection.tsx
// import { useMemo, useState, useEffect, useRef } from "react";
// import { articles as dataArticles } from "@/data/articles";

// type ArticleCard = {
//   id: string | number;
//   title: string;
//   author: string;
//   description: string;
//   image: string;
// };

// export default function MagazineCollectionSection() {
//   const magazineArticles: ArticleCard[] = useMemo(
//     () =>
//       dataArticles
//         .filter((a) => a.section === "magazine" && a.category === "Collection")
//         .map((a) => ({
//           id: a.id,
//           title: a.title,
//           author: a.author?.name ?? "Unknown",
//           description: a.excerpt,
//           image: a.image ?? a.cover,
//         })),
//     []
//   );

//   const shouldHaveOverlay = magazineArticles.length > 4;

//   const [isExpanded, setIsExpanded] = useState(false);
//   const [overlayVisible, setOverlayVisible] = useState(shouldHaveOverlay);
//   const [curtainOpen, setCurtainOpen] = useState(false);
//   const curtainRef = useRef<HTMLDivElement | null>(null);

//   const visibleFirst = magazineArticles.slice(0, 4);
//   const extra = magazineArticles.slice(4);

//   const handleLoadMore = () => {
//     setIsExpanded(true);

//     requestAnimationFrame(() => {
//       setCurtainOpen(true);
//       setOverlayVisible(false);
//     });
//   };

//   useEffect(() => {
//     if (!curtainRef.current) return;
//   }, [isExpanded]);

//   return (
//     <section className="magcol">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;400&display=swap');

//         .magcol { width: 100% !important; background: #000 !important; padding: 4rem 2rem !important; overflow: hidden !important; }
//         .magcol__container { max-width: 1307px !important; margin: 0 auto !important; position: relative !important; padding-bottom: 120px !important; }
//         .magcol__title { font-family: 'Bebas Neue', sans-serif !important; font-weight: 400 !important; font-size: 68px !important; color: #fff !important; margin-bottom: 4rem !important; text-align: left !important; }
//         .magcol__list { display: flex !important; flex-direction: column !important; gap: 5rem !important; }

//         .magcol__article { display: flex !important; position: relative !important; height: 425px !important; align-items: center !important; flex-direction: row !important; }
//         .magcol__imgwrap { height: 100% !important; width: 60% !important; border-radius: 20px !important; overflow: hidden !important; position: relative !important; }
//         .magcol__imgwrap::after { content: '' !important; position: absolute !important; inset: 0 !important; background-color: rgba(0,0,0,0.38) !important; border-radius: 20px !important; }
//         .magcol__img { width: 100% !important; height: 100% !important; object-fit: cover !important; filter: grayscale(1) !important; border-radius: 20px !important; display: block !important; }
//         .magcol__content { position: absolute !important; width: 65% !important; height: 60% !important; padding: 2rem 4rem !important; display: flex !important; flex-direction: column !important; justify-content: center !important; color: #fff !important; top: 50% !important; transform: translateY(-50%) !important; border-radius: 20px !important; }
//         .magcol__article:nth-child(odd)   { justify-content: flex-start !important; }
//         .magcol__article:nth-child(odd) .magcol__content { right: 0 !important; align-items: flex-start !important; text-align: left !important; background: linear-gradient(to left, #171717 75.85%, rgba(23,23,23,0) 99.96%) !important; }
//         .magcol__article:nth-child(even)  { justify-content: flex-end !important; }
//         .magcol__article:nth-child(even) .magcol__content { left: 0 !important; align-items: flex-start !important; text-align: left !important; background: linear-gradient(to right, #171717 75.85%, rgba(23,23,23,0) 99.96%) !important; }
//         .magcol__h3 { font-family: 'Bebas Neue', sans-serif !important; font-weight: 400 !important; font-size: 42px !important; line-height: 1.1 !important; color: #fff !important; margin: 0 0 .5rem 0 !important; text-shadow: 0 4px 50px rgba(0,0,0,0.25) !important; }
//         .magcol__author { font-family: 'Roboto', sans-serif !important; font-weight: 300 !important; font-size: 16px !important; line-height: 24px !important; color: #fff !important; margin: 0 0 1rem 0 !important; }
//         .magcol__desc { font-family: 'Roboto', sans-serif !important; font-weight: 400 !important; font-size: 16px !important; line-height: 1.5 !important; text-align: justify !important; color: #fff !important; margin: 0 !important; }

//         .magcol__loadwrap {
//           position: absolute !important; bottom: 0 !important; left: 0 !important; width: 100% !important; height: 150px !important;
//           display: flex !important; justify-content: center !important; align-items: flex-end !important;
//           background: linear-gradient(0deg, #000 16.35%, rgba(0,0,0,0) 100%) !important;
//           z-index: 5 !important; pointer-events: none !important; padding-bottom: 2rem !important;
//           opacity: 1 !important; visibility: visible !important; transition: opacity .35s ease, visibility 0s linear 0s !important;
//         }
//         .magcol__loadwrap--hidden { opacity: 0 !important; visibility: hidden !important; transition: opacity .35s ease, visibility 0s linear .35s !important; }

//         .magcol__loadbtn {
//           font-family: 'Bebas Neue', cursive !important; font-size: 42px !important; letter-spacing: .05em !important; color: #fff !important;
//           background: none !important; border: none !important; cursor: pointer !important; transition: opacity .3s ease !important; pointer-events: all !important;
//           outline: none !important; box-shadow: none !important; -webkit-tap-highlight-color: transparent !important; appearance: none !important;
//         }
//         .magcol__loadbtn:hover { opacity: .8 !important; }
//         .magcol__loadbtn:focus, .magcol__loadbtn:focus-visible, .magcol__loadbtn:active { outline: none !important; box-shadow: none !important; }

//         .fx-curtainDown { position: relative !important; overflow: hidden !important; }
//         .fx-curtainDown::before {
//           content: '' !important; position: absolute !important; inset: 0 !important; z-index: 2 !important;
//           background: #000 !important; /* bisa diganti gradien halus jika mau */
//           transform-origin: bottom !important; /* penting: buka dari atas ke bawah */
//           transform: scaleY(1) !important;
//           transition: transform .6s cubic-bezier(.25,.8,.3,1) !important;
//           pointer-events: none !important;
//         }
//         .fx-curtainDown.is-open::before { transform: scaleY(0) !important; }

//         @media (max-width: 1350px) { .magcol__container { padding: 0 2rem !important; } }
//         @media (max-width: 968px) {
//           .magcol__article { flex-direction: column !important; height: auto !important; }
//           .magcol__imgwrap, .magcol__content { position: static !important; width: 100% !important; transform: none !important; }
//           .magcol__imgwrap { height: 300px !important; }
//           .magcol__content { background: #171717 !important; border-radius: 20px !important; padding: 2rem !important; margin-top: -2rem !important; position: relative !important; z-index: 2 !important; }
//         }
//       `}</style>

//       <div className="magcol__container">
//         <h2 className="magcol__title">PREVIOUS MAGAZINE</h2>

//         <div className="magcol__list">
//           {visibleFirst.map((a) => (
//             <article key={a.id} className="magcol__article">
//               <div className="magcol__imgwrap">
//                 <img src={a.image} alt={a.title} className="magcol__img" loading="lazy" />
//               </div>
//               <div className="magcol__content">
//                 <h3 className="magcol__h3">{a.title}</h3>
//                 <p className="magcol__author">By {a.author}</p>
//                 <p className="magcol__desc">{a.description}</p>
//               </div>
//             </article>
//           ))}

//           {isExpanded && (
//             <div
//               ref={curtainRef}
//               className={["fx-curtainDown", curtainOpen ? "is-open" : ""].join(" ")}
//             >
//               {extra.map((a) => (
//                 <article key={a.id} className="magcol__article">
//                   <div className="magcol__imgwrap">
//                     <img src={a.image} alt={a.title} className="magcol__img" loading="lazy" />
//                   </div>
//                   <div className="magcol__content">
//                     <h3 className="magcol__h3">{a.title}</h3>
//                     <p className="magcol__author">By {a.author}</p>
//                     <p className="magcol__desc">{a.description}</p>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           )}
//         </div>

//         {shouldHaveOverlay && (
//           <div
//             className={["magcol__loadwrap", overlayVisible ? "" : "magcol__loadwrap--hidden"].join(" ")}
//             aria-hidden={!overlayVisible}
//           >
//             {!isExpanded && (
//               <button type="button" className="magcol__loadbtn" onClick={handleLoadMore}>
//                 LOAD MORE...
//               </button>
//             )}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }


// src/features/magazine/components/MagazineCollectionSection.tsx
import { useMemo, useState, useEffect, useRef } from "react";
import { useHybridArticles } from "@/features/articles/hooks";

type ArticleCard = {
  id: string | number;
  title: string;
  author: string;
  description: string;
  image: string;
};

export default function MagazineCollectionSection() {
  const { articles: hybrid } = useHybridArticles();

  const magazineArticles: ArticleCard[] = useMemo(
    () =>
      (hybrid as any[])
        .filter((a) => a.section === "magazine" && a.category === "Collection")
        .map((a) => ({
          id: a.id,
          title: a.title,
          author: a?.author?.name ?? "Unknown",
          description: a.excerpt,
          image: a.image ?? a.cover,
        })),
    [hybrid]
  );

  const shouldHaveOverlay = magazineArticles.length > 4;

  const [isExpanded, setIsExpanded] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(shouldHaveOverlay);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const curtainRef = useRef<HTMLDivElement | null>(null);

  const visibleFirst = magazineArticles.slice(0, 4);
  const extra = magazineArticles.slice(4);

  const handleLoadMore = () => {
    setIsExpanded(true);

    requestAnimationFrame(() => {
      setCurtainOpen(true);
      setOverlayVisible(false);
    });
  };

  useEffect(() => {
    if (!curtainRef.current) return;
  }, [isExpanded]);

  return (
    <section className="magcol">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;400&display=swap');

        .magcol { width: 100% !important; background: #000 !important; padding: 4rem 2rem !important; overflow: hidden !important; }
        .magcol__container { max-width: 1307px !important; margin: 0 auto !important; position: relative !important; padding-bottom: 120px !important; }
        .magcol__title { font-family: 'Bebas Neue', sans-serif !important; font-weight: 400 !important; font-size: 68px !important; color: #fff !important; margin-bottom: 4rem !important; text-align: left !important; }
        .magcol__list { display: flex !important; flex-direction: column !important; gap: 5rem !important; }

        .magcol__article { display: flex !important; position: relative !important; height: 425px !important; align-items: center !important; flex-direction: row !important; }
        .magcol__imgwrap { height: 100% !important; width: 60% !important; border-radius: 20px !important; overflow: hidden !important; position: relative !important; }
        .magcol__imgwrap::after { content: '' !important; position: absolute !important; inset: 0 !important; background-color: rgba(0,0,0,0.38) !important; border-radius: 20px !important; }
        .magcol__img { width: 100% !important; height: 100% !important; object-fit: cover !important; filter: grayscale(1) !important; border-radius: 20px !important; display: block !important; }
        .magcol__content { position: absolute !important; width: 65% !important; height: 60% !important; padding: 2rem 4rem !important; display: flex !important; flex-direction: column !important; justify-content: center !important; color: #fff !important; top: 50% !important; transform: translateY(-50%) !important; border-radius: 20px !important; }
        .magcol__article:nth-child(odd)   { justify-content: flex-start !important; }
        .magcol__article:nth-child(odd) .magcol__content { right: 0 !important; align-items: flex-start !important; text-align: left !important; background: linear-gradient(to left, #171717 75.85%, rgba(23,23,23,0) 99.96%) !important; }
        .magcol__article:nth-child(even)  { justify-content: flex-end !important; }
        .magcol__article:nth-child(even) .magcol__content { left: 0 !important; align-items: flex-start !important; text-align: left !important; background: linear-gradient(to right, #171717 75.85%, rgba(23,23,23,0) 99.96%) !important; }
        .magcol__h3 { font-family: 'Bebas Neue', sans-serif !important; font-weight: 400 !important; font-size: 42px !important; line-height: 1.1 !important; color: #fff !important; margin: 0 0 .5rem 0 !important; text-shadow: 0 4px 50px rgba(0,0,0,0.25) !important; }
        .magcol__author { font-family: 'Roboto', sans-serif !important; font-weight: 300 !important; font-size: 16px !important; line-height: 24px !important; color: #fff !important; margin: 0 0 1rem 0 !important; }
        .magcol__desc { font-family: 'Roboto', sans-serif !important; font-weight: 400 !important; font-size: 16px !important; line-height: 1.5 !important; text-align: justify !important; color: #fff !important; margin: 0 !important; }

        .magcol__loadwrap {
          position: absolute !important; bottom: 0 !important; left: 0 !important; width: 100% !important; height: 150px !important;
          display: flex !important; justify-content: center !important; align-items: flex-end !important;
          background: linear-gradient(0deg, #000 16.35%, rgba(0,0,0,0) 100%) !important;
          z-index: 5 !important; pointer-events: none !important; padding-bottom: 2rem !important;
          opacity: 1 !important; visibility: visible !important; transition: opacity .35s ease, visibility 0s linear 0s !important;
        }
        .magcol__loadwrap--hidden { opacity: 0 !important; visibility: hidden !important; transition: opacity .35s ease, visibility 0s linear .35s !important; }

        .magcol__loadbtn {
          font-family: 'Bebas Neue', cursive !important; font-size: 42px !important; letter-spacing: .05em !important; color: #fff !important;
          background: none !important; border: none !important; cursor: pointer !important; transition: opacity .3s ease !important; pointer-events: all !important;
          outline: none !important; box-shadow: none !important; -webkit-tap-highlight-color: transparent !important; appearance: none !important;
        }
        .magcol__loadbtn:hover { opacity: .8 !important; }
        .magcol__loadbtn:focus, .magcol__loadbtn:focus-visible, .magcol__loadbtn:active { outline: none !important; box-shadow: none !important; }

        .fx-curtainDown { position: relative !important; overflow: hidden !important; }
        .fx-curtainDown::before {
          content: '' !important; position: absolute !important; inset: 0 !important; z-index: 2 !important;
          background: #000 !important;
          transform-origin: bottom !important;
          transform: scaleY(1) !important;
          transition: transform .6s cubic-bezier(.25,.8,.3,1) !important;
          pointer-events: none !important;
        }
        .fx-curtainDown.is-open::before { transform: scaleY(0) !important; }

        @media (max-width: 1350px) { .magcol__container { padding: 0 2rem !important; } }
        @media (max-width: 968px) {
          .magcol__article { flex-direction: column !important; height: auto !important; }
          .magcol__imgwrap, .magcol__content { position: static !important; width: 100% !important; transform: none !important; }
          .magcol__imgwrap { height: 300px !important; }
          .magcol__content { background: #171717 !important; border-radius: 20px !important; padding: 2rem !important; margin-top: -2rem !important; position: relative !important; z-index: 2 !important; }
        }
      `}</style>

      <div className="magcol__container">
        <h2 className="magcol__title">PREVIOUS MAGAZINE</h2>

        <div className="magcol__list">
          {visibleFirst.map((a) => (
            <article key={a.id} className="magcol__article">
              <div className="magcol__imgwrap">
                <img src={a.image} alt={a.title} className="magcol__img" loading="lazy" />
              </div>
              <div className="magcol__content">
                <h3 className="magcol__h3">{a.title}</h3>
                <p className="magcol__author">By {a.author}</p>
                <p className="magcol__desc">{a.description}</p>
              </div>
            </article>
          ))}

          {isExpanded && (
            <div ref={curtainRef} className={["fx-curtainDown", curtainOpen ? "is-open" : ""].join(" ")}>
              {extra.map((a) => (
                <article key={a.id} className="magcol__article">
                  <div className="magcol__imgwrap">
                    <img src={a.image} alt={a.title} className="magcol__img" loading="lazy" />
                  </div>
                  <div className="magcol__content">
                    <h3 className="magcol__h3">{a.title}</h3>
                    <p className="magcol__author">By {a.author}</p>
                    <p className="magcol__desc">{a.description}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {shouldHaveOverlay && (
          <div className={["magcol__loadwrap", overlayVisible ? "" : "magcol__loadwrap--hidden"].join(" ")} aria-hidden={!overlayVisible}>
            {!isExpanded && (
              <button type="button" className="magcol__loadbtn" onClick={handleLoadMore}>
                LOAD MORE...
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}