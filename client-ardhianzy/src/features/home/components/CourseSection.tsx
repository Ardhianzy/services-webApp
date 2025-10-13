// src/features/home/components/CourseSection.tsx

import { useState, type FC } from "react";

type CourseItem = {
  id: string;
  img: string;
  mainTitle: string;
  subTitle: string;
  date: string;
  excerpt: string;
};

const MAX_TITLE_CHARS = 30;
const CARD_SHADOW = "0 2px 6px rgba(0,0,0,0.2)";

const courseData: CourseItem[] = [
  {
    id: "c-09",
    img: "/assets/course/09.png",
    mainTitle:
      "Kebenaran Sudah Mati, Inilah Dunia Postmodern! Dari Nietzsche Hingga Foucault",
    subTitle: "PHILOSOPHY 101",
    date: "08 Feb 2024",
    excerpt: "Season 2 anime Vinland Saga menjadi anime terbaik tahun lalu…",
  },
  {
    id: "c-08",
    img: "/assets/course/08.png",
    mainTitle:
      "Dari Kesadaran Hingga Revolusi, Dari Idealisme Hegel Hingga Materialisme Marx ",
    subTitle: "PHILOSOPHY 101",
    date: "08 Feb 2024",
    excerpt: "“Tuhan telah mati. Tuhan tetap mati. Dan kita telah membunuhnya.”…",
  },
  {
    id: "c-07",
    img: "/assets/course/07.png",
    mainTitle:
      "Bagaimana Kita Tahu Apa Yang Kita Tahu? | Epistemologi Descartes, Hume dan Kant ",
    subTitle: "PHILOSOPHY 101",
    date: "08 Feb 2024",
    excerpt: "“Tuhan telah mati. Tuhan tetap mati. Dan kita telah membunuhnya.”…",
  },
  {
    id: "c-06",
    img: "/assets/course/06.png",
    mainTitle:
      "Filsafat Politik Yang Mengubah Sejarah! Machiavelli, Hobbes, Locke, dan Rousseau",
    subTitle: "PHILOSOPHY 101",
    date: "08 Feb 2024",
    excerpt: "“Tuhan telah mati. Tuhan tetap mati. Dan kita telah membunuhnya.”…",
  },
];

const PlayIcon: FC = () => (
  <div
    className="absolute left-1/2 top-1/2 flex h-[50px] w-[50px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform duration-200 ease-in-out group-hover:scale-110"
    style={{ background: "#fff", boxShadow: CARD_SHADOW }}
    aria-hidden
  >
    <span
      className="inline-block"
      style={{
        borderStyle: "solid",
        borderWidth: "10px 0 10px 16px",
        borderColor: "transparent transparent transparent #000",
        marginLeft: "4px",
        width: 0,
        height: 0,
      }}
    />
  </div>
);

const CourseCard: FC<CourseItem> = ({ img, mainTitle, subTitle, date, excerpt }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = mainTitle.length > MAX_TITLE_CHARS;
  const displayTitle = !expanded && isLong ? mainTitle.slice(0, MAX_TITLE_CHARS).trim() : mainTitle;

  return (
    <article className="course-card group text-left">
      <div className="course-card-img relative mb-4 h-[200px] w-full overflow-hidden">
        <img
          src={img}
          alt={mainTitle}
          className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-[1.05]"
          loading="lazy"
        />
        <PlayIcon />
      </div>

      <h3
        className="mb-[0.3rem] inline-flex flex-wrap items-center text-[1.5rem] text-white"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        {displayTitle}
        {isLong && !expanded && (
          <button
            type="button"
            className="ml-[0.2rem] cursor-pointer border-0 !bg-transparent !p-0 !px-1 text-[1.5rem] leading-none text-white transition-colors hover:text-[#00aaff]"
            onClick={() => setExpanded(true)}
            aria-label="Show full title"
            title="Show full title"
          >
            …
          </button>
        )}
      </h3>

      <p
        className="mb-[0.8rem] text-[0.9rem] text-white"
        style={{ fontFamily: "'Roboto Condensed', sans-serif", opacity: 0.8 }}
      >
        {subTitle}
      </p>

      <p className="mb-4 text-[0.85rem] text-white" style={{ opacity: 0.8 }}>
        {date}
      </p>

      <p className="mb-4 text-[0.9rem] leading-[1.5] text-white" style={{ opacity: 0.85 }}>
        {excerpt}
      </p>
    </article>
  );
};

const CourseSection: FC = () => {
  return (
    <section id="course" className="relative z-0 mb-50 mt-20 bg-transparent px-0 py-0">
      <div className="absolute inset-x-0 -top-12 -bottom-12 -z-10 bg-black" />

      <div className="course-container mx-auto max-w-[1600px] px-8 py-6">
        <header className="course-header relative mb-2 px-4 md:flex md:items-center md:justify-center">
          <h2
            className="m-0 text-center text-[3rem] text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Membership Course
          </h2>

          <a
            href=" https://www.youtube.com/@ardhianzy"
            className="course-more-button mt-4 inline-flex items-center rounded-[50px] border border-white px-6 py-[0.7rem] text-white transition-colors hover:bg-white/10 md:absolute md:right-8 md:top-1/2 md:mt-0 md:-translate-y-1/2"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", textDecoration: "none" }}
          >
            SEE ALL <span className="ml-2">→</span>
          </a>
        </header>

        <p
          className="mx-auto mb-8 max-w-[532px] px-4 text-center text-[1.1rem] text-white"
          style={{ fontFamily: "Roboto, sans-serif" }}
        >
          Access more Philosophy101 videos. Join{" "}
          <a href=" https://www.youtube.com/@ardhianzy/membership" className="text-[#00aaff] underline">
            membership
          </a>{" "}
          today
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8">
          {courseData.map((item) => (
            <CourseCard key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseSection;