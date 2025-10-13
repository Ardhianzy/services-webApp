// // src/features/magazine/components/MagazineHeadlineSection.tsx
// import { useMemo } from "react";
// // import { articles } from "@/data/articles";

// type FeaturedContent = {
//   title: string;
//   author: string;
//   excerpt: string;
//   publishedAt: string;
//   heroImage: string;
//   image: string;
// };

// function formatDateISOToLong(dateISO: string): string {
//   if (!dateISO || Number.isNaN(Date.parse(dateISO))) return "—";
//   const d = new Date(dateISO);
//   return new Intl.DateTimeFormat("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   }).format(d);
// }

// export default function MagazineHeadlineSection() {
//   const featured: FeaturedContent = useMemo(() => {
//     // const byFeatured =
//     //   articles.find((a) => a.section === "magazine" && a.isFeatured) || null;

//     // const byCategory =
//     //   articles.find(
//     //     (a) => a.section === "magazine" && a.category?.toLowerCase() === "magazine"
//     //   ) || null;

//     // const chosen = byFeatured ?? byCategory;

//     // if (chosen) {
//     //   return {
//     //     title: chosen.title,
//     //     author: chosen.author?.name ?? "Unknown",
//     //     excerpt: chosen.excerpt,
//     //     publishedAt: chosen.publishedAt,
//     //     heroImage: "/assets/magazine/smdamdla.png",
//     //     image: "/assets/magazine/Rectangle 4528.png",
//     //   };
//     // }

//     return {
//       title: "LOREM IPSUM DOLOR SIT",
//       author: "Lorem",
//       excerpt:
//         "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
//       publishedAt: "2025-05-05",
//       heroImage: "/assets/magazine/smdamdla.png",
//       image: "/assets/magazine/Rectangle 4528.png",
//     };
//   }, []);

//   const dateHuman = formatDateISOToLong(featured.publishedAt);

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

//         .mag-head__hero {
//           position: relative !important;
//           width: 100vw !important;
//           height: 60vh !important;
//           background-color: #000 !important;
//           background-size: cover !important;
//           background-position: center !important;
//           background-blend-mode: luminosity !important;
//           display: flex !important;
//           align-items: center !important;
//           justify-content: center !important;
//           left: 50% !important;
//           right: 50% !important;
//           margin-left: -50vw !important;
//           margin-right: -50vw !important;
//           overflow: hidden !important;
//         }
//         .mag-head__overlay {
//           position: absolute !important;
//           inset: 0 !important;
//           background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.3) 70%, transparent 100%) !important;
//           z-index: 1 !important;
//         }
//         .mag-head__title {
//           position: relative !important;
//           z-index: 2 !important;
//           color: #fff !important;
//           font-family: 'Bebas Neue', cursive !important;
//           font-size: 5rem !important;
//           text-align: center !important;
//           text-transform: uppercase !important;
//           letter-spacing: 0 !important;
//           margin: 0 !important;
//         }

//         .mag-head__section {
//           width: 100% !important;
//           background-color: #000 !important;
//           color: #fff !important;
//           padding: 4rem 2rem !important;
//           position: relative !important;
//           overflow: hidden !important;
//           margin: 32px auto 56px auto !important;
//         }
//         .mag-head__grid {
//           max-width: 1200px !important;
//           margin: 0 auto !important;
//           display: grid !important;
//           grid-template-columns: 1fr 1fr !important;
//           gap: 4rem !important;
//           align-items: center !important;
//         }
//         .mag-head__imgwrap {
//           position: relative !important;
//           width: 470px !important;
//           height: 600px !important;
//           left: 2rem !important;
//           background-color: #111 !important;
//           overflow: hidden !important;
//         }
//         .mag-head__img {
//           width: 100% !important;
//           height: 100% !important;
//           object-fit: cover !important;
//           filter: grayscale(100%) !important;
//           display: block !important;
//         }

//         .mag-head__article { padding: 2rem !important; text-align: center !important; }
//         .mag-head__h2 {
//           font-family: 'Bebas Neue', sans-serif !important;
//           font-size: 3.5rem !important;
//           line-height: 1.1 !important;
//           margin: 0 0 1rem 0 !important;
//           letter-spacing: 1px !important;
//           color: #fff !important;
//         }
//         .mag-head__author { font-size: 1.1rem !important; color: #aaa !important; margin-bottom: 2rem !important; }
//         .mag-head__desc   { font-size: 1.25rem !important; line-height: 1.7 !important; color: #ddd !important; margin-bottom: 3rem !important; }
//         .mag-head__date   { font-size: 1rem !important; color: #888 !important; font-style: italic !important; }

//         @media (max-width: 968px) {
//           .mag-head__grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
//           .mag-head__imgwrap { height: 400px !important; left: 0 !important; width: 100% !important; }
//           .mag-head__h2 { font-size: 2.5rem !important; }
//           .mag-head__desc { font-size: 1.1rem !important; }
//         }
//         @media (max-width: 640px) {
//           .mag-head__section { padding: 3rem 1rem !important; }
//           .mag-head__article { padding: 1rem 0 !important; }
//           .mag-head__h2 { font-size: 2rem !important; }
//           .mag-head__desc { font-size: 1rem !important; }
//         }
//       `}</style>

//       <section
//         className="mag-head__hero"
//         style={{ backgroundImage: `url('${featured.heroImage}')` }}
//         aria-label="Magazine hero section"
//       >
//         <div aria-hidden className="mag-head__overlay" />
//         <h1 className="mag-head__title">THE MAGAZINE</h1>
//       </section>

//       <section className="mag-head__section">
//         <div className="mag-head__grid">
//           <div className="mag-head__imgwrap" aria-hidden={false}>
//             <img
//               src={featured.image}
//               alt={featured.title}
//               className="mag-head__img"
//               loading="eager"
//             />
//           </div>

//           <article className="mag-head__article">
//             <h2 className="mag-head__h2">{featured.title}</h2>
//             <p className="mag-head__author">By {featured.author}</p>
//             <p className="mag-head__desc">{featured.excerpt}</p>
//             <time className="mag-head__date" dateTime={featured.publishedAt}>
//               {dateHuman}
//             </time>
//           </article>
//         </div>
//       </section>
//     </>
//   );
// }


// src/features/magazine/components/MagazineHeadlineSection.tsx
import { useMemo } from "react";
import { useHybridArticles } from "@/features/articles/hooks";

type FeaturedContent = {
  title: string;
  author: string;
  excerpt: string;
  publishedAt: string;
  heroImage: string;
  image: string;
};

function formatDateISOToLong(dateISO: string): string {
  if (!dateISO || Number.isNaN(Date.parse(dateISO))) return "—";
  const d = new Date(dateISO);
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(d);
}

export default function MagazineHeadlineSection() {
  const { articles: hybrid } = useHybridArticles();

  const featured: FeaturedContent = useMemo(() => {
    const byFeatured =
      (hybrid as any[]).find((a) => a.section === "magazine" && a.isFeatured) || null;

    const byCategory =
      (hybrid as any[]).find((a) => a.section === "magazine" && (a.category ?? "").toLowerCase() === "magazine") || null;

    const chosen = byFeatured ?? byCategory;

    if (chosen) {
      return {
        title: chosen.title,
        author: chosen.author?.name ?? "Unknown",
        excerpt: chosen.excerpt ?? "",
        publishedAt: chosen.publishedAt ?? "",
        heroImage: "/assets/magazine/smdamdla.png",
        image: chosen.image ?? chosen.cover ?? "/assets/magazine/Rectangle 4528.png",
      };
    }

    return {
      title: "LOREM IPSUM DOLOR SIT",
      author: "Lorem",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      publishedAt: "2025-05-05",
      heroImage: "/assets/magazine/smdamdla.png",
      image: "/assets/magazine/Rectangle 4528.png",
    };
  }, [hybrid]);

  const dateHuman = formatDateISOToLong(featured.publishedAt);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        .mag-head__hero {
          position: relative !important;
          width: 100vw !important;
          height: 60vh !important;
          background-color: #000 !important;
          background-size: cover !important;
          background-position: center !important;
          background-blend-mode: luminosity !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          left: 50% !important;
          right: 50% !important;
          margin-left: -50vw !important;
          margin-right: -50vw !important;
          overflow: hidden !important;
        }
        .mag-head__overlay {
          position: absolute !important;
          inset: 0 !important;
          background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.3) 70%, transparent 100%) !important;
          z-index: 1 !important;
        }
        .mag-head__title {
          position: relative !important;
          z-index: 2 !important;
          color: #fff !important;
          font-family: 'Bebas Neue', cursive !important;
          font-size: 5rem !important;
          text-align: center !important;
          text-transform: uppercase !important;
          letter-spacing: 0 !important;
          margin: 0 !important;
        }

        .mag-head__section {
          width: 100% !important;
          background-color: #000 !important;
          color: #fff !important;
          padding: 4rem 2rem !important;
          position: relative !important;
          overflow: hidden !important;
          margin: 32px auto 56px auto !important;
        }
        .mag-head__grid {
          max-width: 1200px !important;
          margin: 0 auto !important;
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 4rem !important;
          align-items: center !important;
        }
        .mag-head__imgwrap {
          position: relative !important;
          width: 470px !important;
          height: 600px !important;
          left: 2rem !important;
          background-color: #111 !important;
          overflow: hidden !important;
        }
        .mag-head__img {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          filter: grayscale(100%) !important;
          display: block !important;
        }

        .mag-head__article { padding: 2rem !important; text-align: center !important; }
        .mag-head__h2 {
          font-family: 'Bebas Neue', sans-serif !important;
          font-size: 3.5rem !important;
          line-height: 1.1 !important;
          margin: 0 0 1rem 0 !important;
          letter-spacing: 1px !important;
          color: #fff !important;
        }
        .mag-head__author { font-size: 1.1rem !important; color: #aaa !important; margin-bottom: 2rem !important; }
        .mag-head__desc   { font-size: 1.25rem !important; line-height: 1.7 !important; color: #ddd !important; margin-bottom: 3rem !important; }
        .mag-head__date   { font-size: 1rem !important; color: #888 !important; font-style: italic !important; }

        @media (max-width: 968px) {
          .mag-head__grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .mag-head__imgwrap { height: 400px !important; left: 0 !important; width: 100% !important; }
          .mag-head__h2 { font-size: 2.5rem !important; }
          .mag-head__desc { font-size: 1.1rem !important; }
        }
        @media (max-width: 640px) {
          .mag-head__section { padding: 3rem 1rem !important; }
          .mag-head__article { padding: 1rem 0 !important; }
          .mag-head__h2 { font-size: 2rem !important; }
          .mag-head__desc { font-size: 1rem !important; }
        }
      `}</style>

      <section
        className="mag-head__hero"
        style={{ backgroundImage: `url('${featured.heroImage}')` }}
        aria-label="Magazine hero section"
      >
        <div aria-hidden className="mag-head__overlay" />
        <h1 className="mag-head__title">THE MAGAZINE</h1>
      </section>

      <section className="mag-head__section">
        <div className="mag-head__grid">
          <div className="mag-head__imgwrap" aria-hidden={false}>
            <img src={featured.image} alt={featured.title} className="mag-head__img" loading="eager" />
          </div>

          <article className="mag-head__article">
            <h2 className="mag-head__h2">{featured.title}</h2>
            <p className="mag-head__author">By {featured.author}</p>
            <p className="mag-head__desc">{featured.excerpt}</p>
            <time className="mag-head__date" dateTime={featured.publishedAt}>
              {dateHuman}
            </time>
          </article>
        </div>
      </section>
    </>
  );
}