// src/features/home/components/MagazineSection.tsx
import { type FC } from "react";

type SmallCard = {
  img: string;
  alt: string;
  title: string;
  excerpt: string;
  author: string;
};

const BIG_CARD = {
  img: "/assets/magazine/Rectangle 4558.png",
  alt: "Man standing in front of a painting",
  title: "LOREM IPSUM DOLOR SIT",
  author: "Lorem",
  excerpt:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  href: "/magazine",
};

const SMALL_CARDS: SmallCard[] = [
  {
    img: "/assets/magazine/Rectangle 4528.png",
    alt: "Apple on a stand",
    title: "LOREM IPSUM DOLOR SIT",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    author: "Bla Bla Bla",
  },
  {
    img: "/assets/magazine/Rectangle 4529.png",
    alt: "People in a painting",
    title: "LOREM IPSUM DOLOR SIT",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    author: "Bla Bla Bla",
  },
];

const BIG_MIN_H = 450;

const MagazineSection: FC = () => {
  return (
    <section
      id="magazine"
      className="relative w-full overflow-hidden bg-black pt-[120px] mb-50"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[80%] w-[90%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(74,158,255,0.10) 0%, rgba(74,158,255,0.05) 40%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div
        className="relative z-[2] mx-auto w-full max-w-[1560px] px-[80px] max-[1200px]:px-[40px]"
      >
        <div className="mb-[2.5rem] flex items-center justify-between">
          <h2
            className="m-0 text-[3rem] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Check Our Magazine
          </h2>

          <a
            href="/magazine"
            aria-label="Open magazine collection"
            className="inline-flex items-center rounded-[50px] border border-white px-[1.5rem] py-[0.7rem] text-[1rem] text-white no-underline transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            MORE MAGAZINE <span className="ml-[0.3rem]">→</span>
          </a>
        </div>

        <div
          className={[
            "relative z-[2] grid items-start",
            "grid-cols-[3fr_1fr_1fr]",
            "gap-[1.5rem]",
            "max-[1200px]:gap-[1rem]",
            "max-[992px]:grid-cols-2",
            "max-[768px]:grid-cols-1",
          ].join(" ")}
        >
          <article
            className={[
              "relative overflow-hidden bg-transparent",
              "flex pl-[40px]",
              "rounded-[10px]",
              "max-[992px]:col-span-full max-[992px]:mb-[2rem]",
              "max-[768px]:mb-[2rem] max-[768px]:flex-col",
              "max-[768px]:rounded-none max-[768px]:rounded-b-[24px]",
            ].join(" ")}
          >
            <div
              aria-hidden
              className="absolute right-0 top-0 z-0 h-full w-[180%]"
              style={{
                background:
                  "linear-gradient(180deg, #000 0%, #0d0d0d 25%, #151515 60%, #1a1a1a 100%)",
                borderRadius: "inherit",
                pointerEvents: "none",
              }}
            />

            <div
              className="z-[1] mr-[2rem] w-[45%] h-[587px] max-[768px]:mr-0 max-[768px]:w-full"
              style={{ minHeight: BIG_MIN_H }}
            >
              <img
                loading="lazy"
                src={BIG_CARD.img}
                alt={BIG_CARD.alt}
                className="h-full w-full object-cover"
                style={{ mixBlendMode: "luminosity", filter: "grayscale(100%)" }}
              />
            </div>

            <div className="z-[1] w-1/2 pt-[80px] pb-[40px] text-center pr-[40px] pl-0 text-white max-[768px]:w-full max-[768px]:px-[24px] max-[768px]:py-[32px]">
              <h3
                className="mb-[24px] text-[2.5rem]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {BIG_CARD.title}
              </h3>
              <p className="mb-[41px] text-[0.9rem] italic text-white/60">
                By {BIG_CARD.author}
              </p>
              <p className="mb-[25px] text-[1rem] leading-[1.7] text-white/80">
                {BIG_CARD.excerpt}
              </p>
              <a
                href={BIG_CARD.href}
                className="text-[0.95rem] font-medium text-[#4a9eff] no-underline transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                Continue Read &gt;&gt;
              </a>
            </div>
          </article>

          {SMALL_CARDS.map((card, idx) => (
            <article key={idx} className="flex flex-col overflow-hidden bg-transparent">
              <div
                className="mb-[40px] w-full h-[379px]"
              >
                <img
                  loading="lazy"
                  src={card.img}
                  alt={card.alt}
                  className="h-full w-full object-cover"
                />
              </div>

              <div
                className="flex flex-col px-[8px] text-center h-[220px]"
              >
                <h3
                  className="mb-[29px] text-[1.5rem] text-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {card.title}
                </h3>
                <p className="mb-[12px] text-[0.9rem] leading-[1.4] text-white/70">
                  {card.excerpt}
                </p>
                <p className="text-[0.75rem] italic text-white/50">
                  By {card.author}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MagazineSection;