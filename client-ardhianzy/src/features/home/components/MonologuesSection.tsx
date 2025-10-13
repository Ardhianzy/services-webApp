// src/features/home/components/MonologuesSection.tsx
import { type FC } from "react";

type MonoItem = {
  img: string;
  title: string;
  excerpt: string;
  author: string;
};

type FeaturedItem = {
  bg: string;
  title: string;
  img: string;
  excerpt: string;
  author: string;
  price: string;
};

const MONO_ITEMS: MonoItem[] = [
  {
    img: "/assets/monologues/Desain tanpa judul.png",
    title: "LOREM IPSUM DOLOR SIT",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    author: "By bla bla bla",
  },
  {
    img: "/assets/monologues/mono1.png",
    title: "LOREM IPSUM DOLOR SIT",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    author: "By bla bla bla",
  },
  {
    img: "/assets/monologues/mono2.png",
    title: "LOREM IPSUM DOLOR SIT",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    author: "By bla bla bla",
  },
];

const FEATURED_ITEM: FeaturedItem = {
  bg: "/assets/monologues/Group 5020.svg",
  title: "LOREM IPSUM DOLOR SIT",
  img: "/assets/monologues/mono3.png",
  excerpt:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
  author: "By bla bla bla",
  price: "Rp. 50.000",
};

const MonoCard: FC<MonoItem> = ({ img, title, excerpt, author }) => (
  <article className="text-center">
    <div className="mx-auto mb-4 h-[350px] w-[249px] overflow-hidden">
      <img
        loading="lazy"
        decoding="async"
        src={img}
        alt={title}
        className="h-full w-full object-cover"
      />
    </div>

    <h3
      className="mb-2 text-[2.4rem] text-white"
      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
    >
      {title}
    </h3>

    <p
      className="mx-auto mb-[14px] px-2 text-[0.9rem] leading-[1.4] text-white"
      style={{ opacity: 0.85 }}
    >
      {excerpt}
    </p>

    <p className="text-[0.9rem] italic text-white" style={{ opacity: 0.8 }}>
      {author}
    </p>
  </article>
);

const FeaturedMonoCard: FC<FeaturedItem> = ({
  bg,
  title,
  img,
  excerpt,
  author,
  price,
}) => (
  <article
    className="text-center"
    style={{
      backgroundImage: `url('${bg}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}
  >
    <h3
      className="mt-0 mb-4 text-[2.4rem] text-white"
      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
    >
      {title}
    </h3>

    <div className="mx-auto mb-4 h-[249px] w-[249px] overflow-hidden">
      <img
        loading="lazy"
        decoding="async"
        src={img}
        alt="Featured"
        className="h-full w-full object-cover"
      />
    </div>

    <p
      className="mx-auto mb-2 px-4 text-[0.9rem] leading-[1.4] text-white"
      style={{ opacity: 0.85 }}
    >
      {excerpt}
    </p>

    <p className="mb-4 text-[0.9rem] italic text-white" style={{ opacity: 0.8 }}>
      {author}
    </p>

    <p
      className="m-0 text-[1.25rem] text-white"
      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
    >
      {price}
    </p>
  </article>
);

const MonologuesSection: FC = () => {
  return (
    <section id="monologues" aria-labelledby="mono_heading" className="relative mb-50">
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-black"
      />

      <div className="relative z-[1] mx-auto max-w-[1560px] px-16 py-8 max-[768px]:px-4">
        <div className="mb-10 flex items-center justify-between">
          <h2
            id="mono_heading"
            className="m-0 text-[3rem] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Collected Monologues
          </h2>

          <a
            href="/monologues"
            className="inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            MORE MONOLOGUES <span className="ml-[0.3rem]">→</span>
          </a>
        </div>

        <div className="grid grid-cols-4 justify-center h-[542px] gap-8 max-[1200px]:grid-cols-2 max-[768px]:grid-cols-1">
          {MONO_ITEMS.map((item, i) => (
            <MonoCard key={i} {...item} />
          ))}

          <FeaturedMonoCard {...FEATURED_ITEM} />
        </div>
      </div>
    </section>
  );
};

export default MonologuesSection;