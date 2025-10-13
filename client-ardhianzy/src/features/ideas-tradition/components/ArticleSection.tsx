// import { type FC, useMemo, useState } from "react";
// import { articles as dataArticles } from "@/data/articles";

// type ArticleCardVM = {
//   id: string | number;
//   title: string;
//   dateLabel: string;
//   imageUrl: string;
// };

// function formatDateISOToDisplay(iso: string): string {
//   const d = new Date(iso);
//   if (isNaN(d.getTime())) return "";
//   const dd = String(d.getDate()).padStart(2, "0");
//   const mon = d.toLocaleString("en-US", { month: "short" });
//   const yyyy = d.getFullYear();
//   return `${dd} ${mon}, ${yyyy}`;
// }

// const ArticleCardItem: FC<ArticleCardVM> = ({ title, dateLabel, imageUrl }) => {
//   return (
//     <article className="group cursor-pointer text-center">
//       <div
//         className={[
//           "w-full !h-[470px] !mb-[10px]",
//           "!bg-black bg-cover bg-center !bg-blend-luminosity",
//           "transition-transform duration-[400ms] ease-in-out group-hover:!scale-[1.03]",
//           "transition-[filter] group-hover:saturate-[1.2]",
//           "max-[768px]:!h-[400px]",
//         ].join(" ")}
//         style={{ backgroundImage: `url(${imageUrl})` }}
//         aria-label={title}
//       />
//       <div className="flex flex-col items-center">
//         <p className="it__date !mt-4"> {dateLabel} </p>
//         <h3 className="it__title !mt-8 !mb-11"> {title} </h3>
//       </div>
//     </article>
//   );
// };

// const ArticleSection: FC = () => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [overlayVisible, setOverlayVisible] = useState(true);
//   const [curtainOpen, setCurtainOpen] = useState(false);

//   const itArticles: ArticleCardVM[] = useMemo(
//     () =>
//       dataArticles
//         .filter((a) => a.section === "ideas-tradition")
//         .map((a) => ({
//           id: a.id,
//           title: a.title,
//           dateLabel: formatDateISOToDisplay(a.publishedAt),
//           imageUrl: a.image ?? a.cover,
//         })),
//     []
//   );

//   const first = itArticles.slice(0, 9);
//   const extra = itArticles.slice(9);

//   const handleLoadMore = () => {
//     setIsExpanded(true);
//     requestAnimationFrame(() => {
//       setCurtainOpen(true);
//       setOverlayVisible(false);
//     });
//   };

//   return (
//     <section className="w-full !bg-black !py-[60px] text-white">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
//         @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap');

//         .it__date{
//           font-family:'Roboto',sans-serif!important;
//           font-weight:300!important;
//           font-size:15px!important;
//           line-height:18px!important;
//           color:#B3B3B3!important;
//         }
//         .it__title{
//           color:#FFFFFF!important;
//           font-family:'Bebas Neue',cursive!important;
//           font-weight:400!important;
//           font-size:48px!important;
//           line-height:1.1!important;
//           text-shadow:0px 4px 50px rgba(0,0,0,0.25)!important;
//         }
//         @media (max-width:768px){
//           .it__title{ font-size:38px!important; }
//         }

//         .it__loadwrap{
//           position:absolute!important;left:0!important;bottom:0!important;width:100%!important;height:200px!important;
//           display:flex!important;justify-content:center!important;align-items:center!important;
//           background:linear-gradient(0deg,#000 16.35%,rgba(0,0,0,0) 100%)!important; z-index:5!important; pointer-events:none!important;
//         }
//         .it__loadwrap--visible{ opacity:1!important; visibility:visible!important; transition:opacity .35s ease, visibility 0s linear 0s!important; }
//         .it__loadwrap--fadeout{ opacity:0!important; visibility:hidden!important; transition:opacity .35s ease, visibility 0s linear .35s!important; }

//         .it__loadbtn{
//           pointer-events:auto!important; cursor:pointer!important; background:none!important; border:none!important;
//           outline:none!important; box-shadow:none!important; -webkit-tap-highlight-color:transparent!important; appearance:none!important;
//           font-family:'Bebas Neue',cursive!important; font-weight:400!important; font-size:42px!important; line-height:48px!important;
//           letter-spacing:.05em!important; color:#fff!important; transition:opacity .3s ease!important;
//         }
//         .it__loadbtn:hover{ opacity:.8!important; }

//         .fx-curtainDown{ position:relative!important; overflow:hidden!important; }
//         .fx-curtainDown::before{
//           content:''!important; position:absolute!important; inset:0!important; z-index:2!important; background:#000!important;
//           transform-origin:bottom!important; transform:scaleY(1)!important; transition:transform .6s cubic-bezier(.25,.8,.3,1)!important;
//           pointer-events:none!important;
//         }
//         .fx-curtainDown.is-open::before{ transform:scaleY(0)!important; }
//       `}</style>

//       <div className="mx-auto max-w-[1275px] px-[20px]">
//         <div className="relative">
//           <div
//             className={[
//               "grid grid-cols-3 !gap-y-[80px] !gap-x-[40px]",
//               "max-[992px]:grid-cols-2",
//               "max-[768px]:grid-cols-1 max-[768px]:!gap-y-[60px] max-[768px]:!gap-x-0",
//             ].join(" ")}
//           >
//             {first.map((a) => (
//               <ArticleCardItem
//                 key={a.id}
//                 id={a.id}
//                 title={a.title}
//                 dateLabel={a.dateLabel}
//                 imageUrl={a.imageUrl}
//               />
//             ))}
//           </div>

//           {isExpanded && extra.length > 0 && (
//             <div className={["fx-curtainDown", curtainOpen ? "is-open" : ""].join(" ")}>
//               <div
//                 className={[
//                   "grid grid-cols-3 !gap-y-[80px] !gap-x-[40px] !mt-[80px]",
//                   "max-[992px]:grid-cols-2",
//                   "max-[768px]:grid-cols-1 max-[768px]:!gap-y-[60px] max-[768px]:!gap-x-0",
//                 ].join(" ")}
//               >
//                 {extra.map((a) => (
//                   <ArticleCardItem
//                     key={a.id}
//                     id={a.id}
//                     title={a.title}
//                     dateLabel={a.dateLabel}
//                     imageUrl={a.imageUrl}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}

//           {!isExpanded && itArticles.length > 0 && (
//             <div
//               className={[
//                 "it__loadwrap",
//                 overlayVisible ? "it__loadwrap--visible" : "it__loadwrap--fadeout",
//               ].join(" ")}
//               aria-hidden={!overlayVisible}
//             >
//               <button type="button" onClick={handleLoadMore} className="it__loadbtn">
//                 LOAD MORE...
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ArticleSection;
// export { ArticleSection as IdeasTraditionArticlesSection };


// src/features/ideas-tradition/components/ArticleSection.tsx
import { type FC, useMemo, useState } from "react";
import { useHybridArticles } from "@/features/articles/hooks";

type ArticleCardVM = {
  id: string | number;
  title: string;
  dateLabel: string;
  imageUrl: string;
};

function formatDateISOToDisplay(iso?: string): string {
  if (!iso) return "";
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
          "w-full !h-[470px] !mb-[10px]",
          "!bg-black bg-cover bg-center !bg-blend-luminosity",
          "transition-transform duration-[400ms] ease-in-out group-hover:!scale-[1.03]",
          "transition-[filter] group-hover:saturate-[1.2]",
          "max-[768px]:!h-[400px]",
        ].join(" ")}
        style={{ backgroundImage: `url(${imageUrl})` }}
        aria-label={title}
      />
      <div className="flex flex-col items-center">
        <p className="it__date !mt-4"> {dateLabel} </p>
        <h3 className="it__title !mt-8 !mb-11"> {title} </h3>
      </div>
    </article>
  );
};

const ArticleSection: FC = () => {
  const { articles: hybrid } = useHybridArticles();

  const [isExpanded, setIsExpanded] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [curtainOpen, setCurtainOpen] = useState(false);

  const itArticles: ArticleCardVM[] = useMemo(
    () =>
      (hybrid as any[])
        .filter((a) => a.section === "ideas-tradition")
        .map((a) => ({
          id: a.id,
          title: a.title,
          dateLabel: formatDateISOToDisplay(a.publishedAt),
          imageUrl: a.image ?? a.cover,
        })),
    [hybrid]
  );

  const first = itArticles.slice(0, 9);
  const extra = itArticles.slice(9);

  const handleLoadMore = () => {
    setIsExpanded(true);
    requestAnimationFrame(() => {
      setCurtainOpen(true);
      setOverlayVisible(false);
    });
  };

  return (
    <section className="w-full !bg-black !py-[60px] text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400&display=swap');

        .it__date{
          font-family:'Roboto',sans-serif!important;
          font-weight:300!important;
          font-size:15px!important;
          line-height:18px!important;
          color:#B3B3B3!important;
        }
        .it__title{
          color:#FFFFFF!important;
          font-family:'Bebas Neue',cursive!important;
          font-weight:400!important;
          font-size:48px!important;
          line-height:1.1!important;
          text-shadow:0px 4px 50px rgba(0,0,0,0.25)!important;
        }
        @media (max-width:768px){
          .it__title{ font-size:38px!important; }
        }

        .it__loadwrap{
          position:absolute!important;left:0!important;bottom:0!important;width:100%!important;height:200px!important;
          display:flex!important;justify-content:center!important;align-items:center!important;
          background:linear-gradient(0deg,#000 16.35%,rgba(0,0,0,0) 100%)!important; z-index:5!important; pointer-events:none!important;
        }
        .it__loadwrap--visible{ opacity:1!important; visibility:visible!important; transition:opacity .35s ease, visibility 0s linear 0s!important; }
        .it__loadwrap--fadeout{ opacity:0!important; visibility:hidden!important; transition:opacity .35s ease, visibility 0s linear .35s!important; }

        .it__loadbtn{
          pointer-events:auto!important; cursor:pointer!important; background:none!important; border:none!important;
          outline:none!important; box-shadow:none!important; -webkit-tap-highlight-color:transparent!important; appearance:none!important;
          font-family:'Bebas Neue',cursive!important; font-weight:400!important; font-size:42px!important; line-height:48px!important;
          letter-spacing:.05em!important; color:#fff!important; transition:opacity .3s ease!important;
        }
        .it__loadbtn:hover{ opacity:.8!important; }

        .fx-curtainDown{ position:relative!important; overflow:hidden!important; }
        .fx-curtainDown::before{
          content:''!important; position:absolute!important; inset:0!important; z-index:2!important; background:#000!important;
          transform-origin:bottom!important; transform:scaleY(1)!important; transition:transform .6s cubic-bezier(.25,.8,.3,1)!important;
          pointer-events:none!important;
        }
        .fx-curtainDown.is-open::before{ transform:scaleY(0)!important; }
      `}</style>

      <div className="mx-auto max-w-[1275px] px-[20px]">
        <div className="relative">
          <div
            className={[
              "grid grid-cols-3 !gap-y-[80px] !gap-x-[40px]",
              "max-[992px]:grid-cols-2",
              "max-[768px]:grid-cols-1 max-[768px]:!gap-y-[60px] max-[768px]:!gap-x-0",
            ].join(" ")}
          >
            {first.map((a) => (
              <ArticleCardItem
                key={a.id}
                id={a.id}
                title={a.title}
                dateLabel={a.dateLabel}
                imageUrl={a.imageUrl}
              />
            ))}
          </div>

          {isExpanded && extra.length > 0 && (
            <div className={["fx-curtainDown", curtainOpen ? "is-open" : ""].join(" ")}>
              <div
                className={[
                  "grid grid-cols-3 !gap-y-[80px] !gap-x-[40px] !mt-[80px]",
                  "max-[992px]:grid-cols-2",
                  "max-[768px]:grid-cols-1 max-[768px]:!gap-y-[60px] max-[768px]:!gap-x-0",
                ].join(" ")}
              >
                {extra.map((a) => (
                  <ArticleCardItem
                    key={a.id}
                    id={a.id}
                    title={a.title}
                    dateLabel={a.dateLabel}
                    imageUrl={a.imageUrl}
                  />
                ))}
              </div>
            </div>
          )}

          {!isExpanded && itArticles.length > 0 && (
            <div
              className={[
                "it__loadwrap",
                overlayVisible ? "it__loadwrap--visible" : "it__loadwrap--fadeout",
              ].join(" ")}
              aria-hidden={!overlayVisible}
            >
              <button type="button" onClick={handleLoadMore} className="it__loadbtn">
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