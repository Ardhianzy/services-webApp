// src/features/home/components/PopCultureReviewSection.tsx
import { useEffect, useMemo, useState, type FC, type CSSProperties } from "react";

type ReviewItem = {
  img: string;
  title: string;
  excerpt: string;
  link: string;
};

const REVIEWS: ReviewItem[] = [
  {
    img: "/assets/popCulture/pop1.jpg",
    title: "LOREM IPSUM DOLOR SIT",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    link: "#",
  },
  {
    img: "/assets/popCulture/pop2.jpg",
    title: "LOREM IPSUM DOLOR SIT",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    link: "#",
  },
  {
    img: "/assets/popCulture/pop3.jpg",
    title: "LOREM IPSUM DOLOR SIT",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    link: "#",
  },
  {
    img: "/assets/popCulture/pop4.jpg",
    title: "LOREM IPSUM DOLOR SIT",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
    link: "#",
  },
];

const FEATURED: ReviewItem = {
  img: "/assets/popCulture/pop-featured.jpg",
  title: "LOREM IPSUM DOLOR SIT",
  excerpt:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
  link: "#",
};

const OVERLAY_GRADIENT =
  "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 70%)";

const GRID_WIDE_POS: Record<number, CSSProperties> = {
  0: { gridColumn: "1 / span 2", gridRow: "1" },
  1: { gridColumn: "3", gridRow: "1" },
  2: { gridColumn: "1", gridRow: "2" },
  3: { gridColumn: "2 / span 2", gridRow: "2" },
};

const ReviewCard: FC<ReviewItem & { style?: CSSProperties }> = ({
  img,
  title,
  excerpt,
  link,
  style,
}) => (
  <article className="relative overflow-hidden rounded-[30px]" style={style}>
    <img
      loading="lazy"
      decoding="async"
      src={img}
      alt={title}
      className="h-full w-full object-cover"
    />

    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ background: OVERLAY_GRADIENT }}
    />

    <div className="absolute bottom-6 left-6 right-6 z-[2] flex flex-col text-left text-white">
      <h3
        className="mb-2 text-[1.5rem]"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        {title}
      </h3>
      <p
        className="mb-3 text-[0.9rem] leading-[1.4]"
        style={{ fontFamily: "'Roboto Condensed', sans-serif", opacity: 0.85 }}
      >
        {excerpt}
      </p>
      <a
        href={link}
        className="inline-flex items-center text-[0.9rem] underline"
        aria-label={`View: ${title}`}
        style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
      >
        view <span className="ml-[0.3rem]">→</span>
      </a>
    </div>
  </article>
);

const FeaturedReviewCard: FC<
  ReviewItem & { boxStyle?: CSSProperties; imgHeight: string }
> = ({ img, title, excerpt, link, boxStyle, imgHeight }) => (
  <article
    className="relative flex flex-col justify-end overflow-hidden rounded-[30px]"
    style={boxStyle}
  >
    <img
      loading="lazy"
      decoding="async"
      src={img}
      alt={title}
      className="w-full object-cover"
      style={{ height: imgHeight }}
    />

    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{ background: OVERLAY_GRADIENT }}
    />

    <div className="absolute bottom-6 left-6 right-6 z-[2] flex flex-col text-left text-white">
      <h3
        className="mb-2 text-[1.5rem]"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        {title}
      </h3>
      <p
        className="mb-3 text-[0.9rem] leading-[1.4]"
        style={{ fontFamily: "'Roboto Condensed', sans-serif", opacity: 0.85 }}
      >
        {excerpt}
      </p>
      <a
        href={link}
        className="inline-flex items-center text-[0.9rem] underline"
        aria-label={`View: ${title}`}
        style={{ fontFamily: "'Roboto Condensed', sans-serif" }}
      >
        view <span className="ml-[0.3rem]">→</span>
      </a>
    </div>
  </article>
);

const PopCultureReviewSection: FC = () => {
  const [vw, setVw] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1920
  );

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { gridTemplateColumns, featuredImgHeight, isNarrow } = useMemo(() => {
    const isMobile = vw <= 768;
    const narrow = vw <= 1200;

    const gtc = isMobile
      ? "1fr"
      : narrow
      ? "repeat(2, 1fr)"
      : "295px 114px 295px 400px";

    const featuredH = isMobile || narrow ? "350px" : `calc(320px * 2 + 1rem)`;

    return {
      gridTemplateColumns: gtc,
      featuredImgHeight: featuredH,
      isNarrow: narrow,
    };
  }, [vw]);

  return (
    <section id="pop-culture" aria-labelledby="pop_heading" className="relative mt-50">
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 bg-black"
      />

      <div className="relative z-[1] mx-auto flex max-w-[1400px] flex-col items-center px-8 py-6">
        <div className="mb-6 flex w-full items-center justify-between">
          <h2
            id="pop_heading"
            className="m-0 text-[3rem] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Pop-Culture Review
          </h2>

          <a
            href="/PopCultureReview"
            className="inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1rem",
              textDecoration: "none",
            }}
          >
            SEE ALL <span className="ml-[0.3rem]">→</span>
          </a>
        </div>

        <div
          className="grid"
          style={{
            gridTemplateColumns,
            gridAutoRows: "320px",
            gap: "2.5rem",
            width: isNarrow ? "100%" : "fit-content",
            margin: "0 auto",
          }}
        >
          {REVIEWS.map((item, i) => (
            <ReviewCard key={i} {...item} style={!isNarrow ? GRID_WIDE_POS[i] : {}} />
          ))}

          <FeaturedReviewCard
            {...FEATURED}
            imgHeight={featuredImgHeight}
            boxStyle={
              !isNarrow
                ? { gridColumn: "4", gridRow: "1 / span 2", width: "400px" }
                : { gridColumn: "1 / -1" }
            }
          />
        </div>
      </div>
    </section>
  );
};

export default PopCultureReviewSection;