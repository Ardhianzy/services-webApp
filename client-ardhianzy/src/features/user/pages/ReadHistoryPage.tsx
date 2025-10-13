// import { useNavigate, Link } from "react-router-dom";
// import { readHistoryIds } from "@/data/history";
// import { articles } from "@/data/articles";

// type ContentBlock = { type: string; text?: string };
// type Article = {
//   id: string | number;
//   title: string;
//   image?: string;
//   cover?: string;
//   thumbnail?: string;
//   content?: string | ContentBlock[];
//   excerpt?: string;
// };

// function getImageSrc(a: Article): string | undefined {
//   return a.image ?? a.cover ?? a.thumbnail;
// }

// function trim(text: string, n = 250) {
//   return text.length > n ? text.slice(0, n) + "..." : text;
// }

// function getSnippet(a: Article): string {
//   if (a.content) {
//     if (typeof a.content === "string") return trim(a.content);
//     const firstPara = (a.content as ContentBlock[]).find(
//       (b) => b?.type === "paragraph" && b.text
//     );
//     if (firstPara?.text) return trim(firstPara.text);
//   }
//   if (a.excerpt) return trim(a.excerpt);
//   return "Click to read more...";
// }

// export default function ReadHistoryPage() {
//   const navigate = useNavigate();

//   const idSet = new Set(readHistoryIds.map(String));
//   const readArticles: Article[] = (articles as unknown as Article[]).filter((a) =>
//     idSet.has(String(a.id))
//   );

//   const bgImageUrl = "/assets/jack-hunter-1L4E_lsIb9Q-unsplash%201.png";

//   return (
//     <div
//       className="relative bg-black text-[#F5F5F5] min-h-screen overflow-x-hidden pt-[140px] pb-[50px] px-10"
//       style={{ fontFamily: "'Roboto', sans-serif" }}
//     >
//       <div
//         className="absolute z-[1] top-[-3px] left-[-75px] w-[662px] h-[1100px] bg-cover bg-no-repeat"
//         style={{ backgroundImage: `url('${bgImageUrl}')` }}
//       />
//       <div
//         className="absolute z-[2] top-0 h-full right-[60%] w-1/2
//                    bg-[linear-gradient(to_left,rgba(0,0,0,1)_20%,rgba(0,0,0,0)_100%)]"
//       />
//       <div
//         className="absolute z-[2] left-0 w-full
//                    bg-[linear-gradient(to_top,rgba(0,0,0,1)_20%,rgba(0,0,0,0)_100%)]"
//         style={{ bottom: "18%", height: "50%" }}
//       />

//       <button
//         type="button"
//         onClick={() => navigate(-1)}
//         className="absolute z-20 left-10 top-[140px] flex items-center gap-[6px] px-5 py-[10px]
//                    bg-transparent border border-[#F5F5F5] rounded-[30px] text-[#F5F5F5]
//                    hover:bg-[rgba(245,245,245,0.1)] transition-colors"
//         style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}
//       >
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//           <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//         <span style={{ lineHeight: 1 }}>Back</span>
//       </button>

//       <div className="relative z-10 max-w-[1030px] mx-auto px-5">
//         <h1
//           className="mb-10 text-left m-0"
//           style={{
//             fontFamily: "'Bebas Neue', sans-serif",
//             fontWeight: 400,
//             fontSize: "72px",
//             lineHeight: "86px",
//             color: "#F5F5F5",
//           }}
//         >
//           Your Library
//         </h1>

//         <div className="w-full border-b border-[#222222] mb-[60px] relative">
//           <div
//             className="inline-block relative mb-[-1px] cursor-pointer"
//             style={{
//               fontFamily: "'Roboto', sans-serif",
//               fontWeight: 400,
//               fontSize: "18px",
//               lineHeight: "21px",
//               color: "#FFFFFF",
//               padding: "5px 10px 5px 0",
//               left: "-45%",
//             }}
//           >
//             History read
//             <div
//               className="absolute"
//               style={{
//                 left: 0,
//                 bottom: "-1px",
//                 width: "159px",
//                 height: "1px",
//                 backgroundColor: "#F5F5F5",
//               }}
//             />
//           </div>
//         </div>

//         <div className="flex flex-col gap-[60px]">
//           {readArticles.length > 0 ? (
//             readArticles.map((article) => (
//               <Link
//                 to={`/read/${article.id}`}
//                 key={String(article.id)}
//                 className="block no-underline text-inherit rounded-[8px]
//                            transition-colors duration-200 group
//                            hover:bg-[rgba(255,255,255,0.05)]"
//               >
//                 <div className="flex justify-between items-start gap-[30px] py-5">
//                   <div className="flex-1 max-w-[595px]">
//                     <h2
//                       className="m-0 mb-5 text-left"
//                       style={{
//                         fontFamily: "'Bebas Neue', sans-serif",
//                         fontWeight: 400,
//                         fontSize: "42px",
//                         lineHeight: "50px",
//                         color: "#F5F5F5",
//                       }}
//                     >
//                       {article.title}
//                     </h2>
//                     <p
//                       className="m-0 text-left"
//                       style={{
//                         fontFamily: "'Roboto', sans-serif",
//                         fontWeight: 400,
//                         fontSize: "18px",
//                         lineHeight: "21px",
//                         color: "#F5F5F5",
//                       }}
//                     >
//                       {getSnippet(article)}
//                     </p>
//                   </div>

//                   <div className="w-[258px] h-[181px] shrink-0">
//                     <img
//                       src={getImageSrc(article)}
//                       alt={article.title}
//                       className="w-full h-full object-cover rounded-[4px]
//                                  mix-blend-luminosity opacity-80
//                                  transition-[mix-blend-mode,opacity] duration-300
//                                  group-hover:mix-blend-normal group-hover:opacity-100"
//                     />
//                   </div>
//                 </div>
//               </Link>
//             ))
//           ) : (
//             <p className="m-0">Your reading history is empty.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }