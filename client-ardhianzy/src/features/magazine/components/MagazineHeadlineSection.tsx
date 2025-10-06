// src/features/magazine/components/MagazineHeadlineSection.tsx
import { useMemo } from "react";
import { articles } from "@/data/articles";

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
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export default function MagazineHeadlineSection() {
  const featured: FeaturedContent = useMemo(() => {
    const byFeatured =
      articles.find((a) => a.section === "magazine" && a.isFeatured) || null;

    const byCategory =
      articles.find(
        (a) => a.section === "magazine" && a.category?.toLowerCase() === "magazine"
      ) || null;

    const chosen = byFeatured ?? byCategory;

    if (chosen) {
      return {
        title: chosen.title,
        author: chosen.author?.name ?? "Unknown",
        excerpt: chosen.excerpt,
        publishedAt: chosen.publishedAt,
        heroImage:
          chosen.image ?? chosen.cover ?? "/assets/magazine/smdamdla.png",
        image: chosen.image ?? chosen.cover ?? "/assets/magazine/Rectangle 4528.png",
      };
    }

    return {
      title: "LOREM IPSUM DOLOR SIT",
      author: "By Lorem",
      excerpt:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      publishedAt: "2025-05-05",
      heroImage: "/assets/magazine/smdamdla.png",
      image: "/assets/magazine/Rectangle 4528.png",
    };
  }, []);

  const dateHuman = formatDateISOToLong(featured.publishedAt);

  return (
    <>
      <section
        className="
          relative h-[60vh] w-screen
          left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
          flex items-center justify-center overflow-hidden
          bg-black bg-cover bg-center
        "
        style={{
          backgroundImage: `url('${featured.heroImage}')`,
          backgroundBlendMode: "luminosity",
        }}
        aria-label="Magazine hero section"
      >
        <div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.3) 70%, transparent 100%)",
          }}
        />
        <h1
          className='relative z-[2] text-center font-["Bebas Neue"] text-[5rem] uppercase text-white'
        >
          THE MAGAZINE
        </h1>
      </section>

      <section className="w-full overflow-hidden bg-black px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div
            className="
              relative h-[400px] w-full overflow-hidden bg-[#111]
              lg:h-[600px] lg:w-[470px] lg:left-8
            "
            aria-hidden={false}
          >
            <img
              src={featured.image}
              alt={featured.title}
              className="h-full w-full object-cover grayscale"
              loading="eager"
            />
          </div>

          <article className="p-4 sm:p-6 lg:p-8">
            <h2 className='mb-4 font-["Bebas Neue"] text-[3.5rem] leading-[1.1] tracking-[1px]'>
              {featured.title}
            </h2>

            <p className="mb-8 text-[1.1rem] text-[#aaa]">By {featured.author}</p>

            <p className="mb-12 text-[1.25rem] leading-[1.7] text-[#ddd]">
              {featured.excerpt}
            </p>

            <time
              className="text-[1rem] italic text-[#888]"
              dateTime={featured.publishedAt}
              aria-label={`Published at ${dateHuman}`}
            >
              {dateHuman}
            </time>
          </article>
        </div>
      </section>
    </>
  );
}