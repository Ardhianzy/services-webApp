// // src/features/pop-culture/components/PopCultureReviewArticlesSection.tsx
// import { useMemo, useState } from "react";
// import { articles as dataArticles } from "@/data/articles";

// type ArticleCard = {
//   id: string | number;
//   title: string;
//   date: string;
//   image: string;
// };

// type Props = {
//   articles?: ArticleCard[];
// };

// function formatDate(iso: string) {
//   const d = new Date(`${iso}T00:00:00`);
//   if (Number.isNaN(d.getTime())) return iso;
//   const month = d.toLocaleString("en-US", { month: "long" });
//   return `${d.getDate()} ${month}, ${d.getFullYear()}`;
// }

// export default function PopCultureReviewArticlesSection({ articles }: Props) {
//   const itemsFromCenter: ArticleCard[] = useMemo(
//     () =>
//       dataArticles
//         .filter((a) => a.section === "pop-cultures" && a.category === "Review")
//         .map((a) => ({
//           id: a.id,
//           title: a.title,
//           date: formatDate(a.publishedAt),
//           image: a.image ?? a.cover,
//         })),
//     []
//   );

//   const source = (articles?.length ? articles : itemsFromCenter) as ArticleCard[];
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [overlayVisible, setOverlayVisible] = useState(true);
//   const [curtainOpen, setCurtainOpen] = useState(false);

//   if (!source.length) return null;

//   const first = source.slice(0, 9);
//   const extra = source.slice(9);

//   const onLoadMore = () => {
//     setIsExpanded(true);
//     requestAnimationFrame(() => {
//       setCurtainOpen(true);
//       setOverlayVisible(false);
//     });
//   };

//   return (
//     <section className="w-full bg-black text-white py-[60px]">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap');

//         .pc__bebas { font-family: 'Bebas Neue', cursive !important; }
//         .pc__roboto { font-family: 'Roboto', sans-serif !important; }

//         .fx-curtainDown { position: relative !important; overflow: hidden !important; }
//         .fx-curtainDown::before{
//           content:'' !important; position:absolute !important; inset:0 !important; z-index:2 !important;
//           background:#000 !important; transform-origin:bottom !important; transform:scaleY(1) !important;
//           transition:transform .6s cubic-bezier(.25,.8,.3,1) !important; pointer-events:none !important;
//         }
//         .fx-curtainDown.is-open::before{ transform:scaleY(0) !important; }

//         .pcr__loadwrap--visible{ opacity:1 !important; visibility:visible !important; transition:opacity .35s ease, visibility 0s linear 0s !important; }
//         .pcr__loadwrap--hidden{  opacity:0 !important; visibility:hidden !important; transition:opacity .35s ease, visibility 0s linear .35s !important; }

//         .pcr__loadbtn{
//           pointer-events:auto !important; cursor:pointer !important; background:none !important; border:none !important;
//           outline:none !important; box-shadow:none !important; -webkit-tap-highlight-color:transparent !important; appearance:none !important;
//           font-family:'Bebas Neue',cursive !important; font-weight:400 !important; font-size:42px !important; line-height:48px !important;
//           letter-spacing:.05em !important; color:#FFFFFF !important; transition:opacity .3s ease !important;
//         }
//         .pcr__loadbtn:hover{ opacity:.8 !important; }

//         .pc-grid { grid-template-columns: repeat(3, 1fr); gap: 80px 40px; }

//         .pc-card .pc-img { transition: transform .4s ease, filter .4s ease; }
//         .pc-card:hover .pc-img { transform: scale(1.03); filter: saturate(1.2); }

//         @media (max-width: 992px) { .pc-grid { grid-template-columns: repeat(2, 1fr); } }

//         @media (max-width: 768px) {
//           .pc-grid { grid-template-columns: 1fr; gap: 60px 0; }
//           .pc-img { height: 400px; }
//           .pc-title { font-size: 38px !important; }
//         }
//       `}</style>

//       <div className="mx-auto max-w-[1275px] px-5">
//         <div className="relative">

//           <div className="pc-grid grid">
//             {first.map((article) => (
//               <article key={article.id} className="pc-card text-center cursor-pointer mt-5">
//                 <div
//                   className="pc-img w-full h-[470px] bg-cover bg-center bg-black mb-[10px]"
//                   style={{ backgroundImage: `url(${article.image})`, backgroundBlendMode: "luminosity" }}
//                   aria-label={article.title}
//                 />
//                 <div className="flex flex-col items-center">
//                   <p
//                     className="pc__roboto text-[#B3B3B3] mb-[-23px] mt-4"
//                     style={{ fontWeight: 300, fontSize: "15px", lineHeight: "18px" }}
//                   >
//                     {article.date}
//                   </p>
//                   <h3
//                     className="pc__bebas pc-title mt-10"
//                     style={{ fontWeight: 400, fontSize: "48px", lineHeight: 1.1, textShadow: "0px 4px 50px rgba(0,0,0,0.25)" }}
//                   >
//                     {article.title}
//                   </h3>
//                 </div>
//               </article>
//             ))}
//           </div>

//           {isExpanded && extra.length > 0 && (
//             <div className={["fx-curtainDown", curtainOpen ? "is-open" : ""].join(" ")}>
//               <div className="pc-grid grid mt-[80px]">
//                 {extra.map((article) => (
//                   <article key={article.id} className="pc-card text-center cursor-pointer">
//                     <div
//                       className="pc-img w-full h-[470px] bg-cover bg-center bg-black mb-[10px]"
//                       style={{ backgroundImage: `url(${article.image})`, backgroundBlendMode: "luminosity" }}
//                       aria-label={article.title}
//                     />
//                     <div className="flex flex-col items-center">
//                       <p
//                         className="pc__roboto text-[#B3B3B3] mb-[-23px] mt-4"
//                         style={{ fontWeight: 300, fontSize: "15px", lineHeight: "18px" }}
//                       >
//                         {article.date}
//                       </p>
//                       <h3
//                         className="pc__bebas pc-title mt-10"
//                         style={{ fontWeight: 400, fontSize: "48px", lineHeight: 1.1, textShadow: "0px 4px 50px rgba(0,0,0,0.25)" }}
//                       >
//                         {article.title}
//                       </h3>
//                     </div>
//                   </article>
//                 ))}
//               </div>
//             </div>
//           )}

//           {(overlayVisible || !isExpanded) && (
//             <div
//               aria-hidden={overlayVisible ? undefined : true}
//               className={[
//                 "pointer-events-none absolute bottom-0 left-0 z-[5] flex h-[200px] w-full items-center justify-center",
//                 overlayVisible ? "pcr__loadwrap--visible" : "pcr__loadwrap--hidden",
//               ].join(" ")}
//               style={{ background: "linear-gradient(0deg, #000000 16.35%, rgba(0, 0, 0, 0) 100%)" }}
//             >
//               {!isExpanded && (
//                 <button type="button" onClick={onLoadMore} className="pcr__loadbtn">
//                   LOAD MORE...
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }


// src/features/pop-culture/components/PopCultureReviewArticlesSection.tsx
import { useMemo, useState } from "react";
import { useHybridArticles } from "@/features/articles/hooks";

type ArticleCard = {
  id: string | number;
  title: string;
  date: string;
  image: string;
};

type Props = {
  articles?: ArticleCard[];
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "—";
  const month = d.toLocaleString("en-US", { month: "long" });
  return `${d.getDate()} ${month}, ${d.getFullYear()}`;
}

export default function PopCultureReviewArticlesSection({ articles }: Props) {
  const { articles: hybrid } = useHybridArticles();

  const itemsFromCenter: ArticleCard[] = useMemo(
    () =>
      (hybrid as any[])
        .filter((a) => a.section === "pop-cultures" && a.category === "Review")
        .map((a) => ({
          id: a.id,
          title: a.title,
          date: formatDate(a.publishedAt),
          image: a.image ?? a.cover,
        })),
    [hybrid]
  );

  const source = (articles?.length ? articles : itemsFromCenter) as ArticleCard[];
  const [isExpanded, setIsExpanded] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [curtainOpen, setCurtainOpen] = useState(false);

  if (!source.length) return null;

  const first = source.slice(0, 9);
  const extra = source.slice(9);

  const onLoadMore = () => {
    setIsExpanded(true);
    requestAnimationFrame(() => {
      setCurtainOpen(true);
      setOverlayVisible(false);
    });
  };

  return (
    <section className="w-full bg-black text-white py-[60px]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap');

        .pc__bebas { font-family: 'Bebas Neue', cursive !important; }
        .pc__roboto { font-family: 'Roboto', sans-serif !important; }

        .fx-curtainDown { position: relative !important; overflow: hidden !important; }
        .fx-curtainDown::before{
          content:'' !important; position:absolute !important; inset:0 !important; z-index:2 !important;
          background:#000 !important; transform-origin:bottom !important; transform:scaleY(1) !important;
          transition:transform .6s cubic-bezier(.25,.8,.3,1) !important; pointer-events:none !important;
        }
        .fx-curtainDown.is-open::before{ transform:scaleY(0) !important; }

        .pcr__loadwrap--visible{ opacity:1 !important; visibility:visible !important; transition:opacity .35s ease, visibility 0s linear 0s !important; }
        .pcr__loadwrap--hidden{  opacity:0 !important; visibility:hidden !important; transition:opacity .35s ease, visibility 0s linear .35s !important; }

        .pcr__loadbtn{
          pointer-events:auto !important; cursor:pointer !important; background:none !important; border:none !important;
          outline:none !important; box-shadow:none !important; -webkit-tap-highlight-color:transparent !important; appearance:none !important;
          font-family:'Bebas Neue',cursive !important; font-weight:400 !important; font-size:42px !important; line-height:48px !important;
          letter-spacing:.05em !important; color:#FFFFFF !important; transition:opacity .3s ease !important;
        }
        .pcr__loadbtn:hover{ opacity:.8 !important; }

        .pc-grid { grid-template-columns: repeat(3, 1fr); gap: 80px 40px; }

        .pc-card .pc-img { transition: transform .4s ease, filter .4s ease; }
        .pc-card:hover .pc-img { transform: scale(1.03); filter: saturate(1.2); }

        @media (max-width: 992px) { .pc-grid { grid-template-columns: repeat(2, 1fr); } }

        @media (max-width: 768px) {
          .pc-grid { grid-template-columns: 1fr; gap: 60px 0; }
          .pc-img { height: 400px; }
          .pc-title { font-size: 38px !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[1275px] px-5">
        <div className="relative">

          <div className="pc-grid grid">
            {first.map((article) => (
              <article key={article.id} className="pc-card text-center cursor-pointer mt-5">
                <div
                  className="pc-img w-full h-[470px] bg-cover bg-center bg-black mb-[10px]"
                  style={{ backgroundImage: `url(${article.image})`, backgroundBlendMode: "luminosity" }}
                  aria-label={article.title}
                />
                <div className="flex flex-col items-center">
                  <p
                    className="pc__roboto text-[#B3B3B3] mb-[-23px] mt-4"
                    style={{ fontWeight: 300, fontSize: "15px", lineHeight: "18px" }}
                  >
                    {article.date}
                  </p>
                  <h3
                    className="pc__bebas pc-title mt-10"
                    style={{ fontWeight: 400, fontSize: "48px", lineHeight: 1.1, textShadow: "0px 4px 50px rgba(0,0,0,0.25)" }}
                  >
                    {article.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>

          {isExpanded && extra.length > 0 && (
            <div className={["fx-curtainDown", curtainOpen ? "is-open" : ""].join(" ")}>
              <div className="pc-grid grid mt-[80px]">
                {extra.map((article) => (
                  <article key={article.id} className="pc-card text-center cursor-pointer">
                    <div
                      className="pc-img w-full h-[470px] bg-cover bg-center bg-black mb-[10px]"
                      style={{ backgroundImage: `url(${article.image})`, backgroundBlendMode: "luminosity" }}
                      aria-label={article.title}
                    />
                    <div className="flex flex-col items-center">
                      <p
                        className="pc__roboto text-[#B3B3B3] mb-[-23px] mt-4"
                        style={{ fontWeight: 300, fontSize: "15px", lineHeight: "18px" }}
                      >
                        {article.date}
                      </p>
                      <h3
                        className="pc__bebas pc-title mt-10"
                        style={{ fontWeight: 400, fontSize: "48px", lineHeight: 1.1, textShadow: "0px 4px 50px rgba(0,0,0,0.25)" }}
                      >
                        {article.title}
                      </h3>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {(overlayVisible || !isExpanded) && (
            <div
              aria-hidden={overlayVisible ? undefined : true}
              className={[
                "pointer-events-none absolute bottom-0 left-0 z-[5] flex h-[200px] w-full items-center justify-center",
                overlayVisible ? "pcr__loadwrap--visible" : "pcr__loadwrap--hidden",
              ].join(" ")}
              style={{ background: "linear-gradient(0deg, #000000 16.35%, rgba(0, 0, 0, 0) 100%)" }}
            >
              {!isExpanded && (
                <button type="button" onClick={onLoadMore} className="pcr__loadbtn">
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