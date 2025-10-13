// src/features/reading-guide/components/ReadingGuideHighlightSection.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  books as centerBooksRaw,
  authors as centerAuthors,
  guides as centerGuidesRaw,
} from "@/data/books";

export type RGAuthor = { id: string | number; name: string };
export type RGBook = {
  id: string | number;
  title: string;
  coverImg: string;
  authorId?: string | number;
};
export type RGGuide = {
  id: string | number;
  title: string;
  excerpt: string;
  targetBookId: string | number;
  authorId: string | number;
};

type Props = {
  guides?: RGGuide[];
  books?: RGBook[];
  authors?: RGAuthor[];
  initialIndex?: number;
};

const centerBooks: RGBook[] = centerBooksRaw.map((b) => ({
  id: b.id,
  title: b.title,
  coverImg: b.cover,
  authorId: b.authorId,
}));

const centerGuides: RGGuide[] = centerGuidesRaw.map((g) => ({
  id: g.id,
  title: g.title,
  excerpt: g.excerpt,
  targetBookId: g.targetBookId ?? g.steps[0]?.bookId,
  authorId: g.authorId,
}));

export default function ReadingGuideHighlightSection({
  guides = centerGuides,
  books = centerBooks,
  authors = centerAuthors,
  initialIndex = 0,
}: Partial<Props>) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const totalSlides = guides.length;

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);

  return (
    <div className="text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;400;600&display=swap');
        .rg__bebas { font-family: 'Bebas Neue', cursive !important; }
        .rg__roboto { font-family: 'Roboto', sans-serif !important; }
      `}</style>

      <section
        className="relative flex items-center justify-center"
        style={{
          width: "100vw",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          height: "60vh",
          backgroundImage: "url('/assets/readingGuide/belajar2.png')",
          backgroundColor: "#000",
          backgroundBlendMode: "luminosity",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 30%, transparent 100%)",
          }}
        />
        <h1 className="relative z-[2] rg__bebas uppercase text-white text-center !text-[5rem]">
          READING GUIDE
        </h1>
      </section>

      <div className="bg-black flex flex-col items-center !py-[60px]">
        <section className="relative w-full max-w-[1100px] flex items-center justify-center !mb-[30px]">
          <img
            src="/assets/readingGuide/Group 5185.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none opacity-50 absolute z-[5] top-1/2 -translate-y-1/2 h-[700px] left-[-420px]"
          />
          <img
            src="/assets/readingGuide/Group 5184.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none opacity-50 absolute z-[5] top-1/2 -translate-y-1/2 h-[700px] right-[-499px]"
          />

          <button
            type="button"
            aria-label="Previous book"
            onClick={handlePrev}
            className="absolute top-1/2 -translate-y-1/2 left-0 z-10 flex items-center justify-center !w-[61px] !h-[61px] !rounded-full text-white !text-[2rem] backdrop-blur-[5px] transition-colors"
            style={{ background: "rgba(177,177,177,0.15)", lineHeight: 0, padding: 0, border: "none" }}
            onMouseEnter={(e) =>
              ((e.currentTarget.style.background = "rgba(177,177,177,0.3)"))
            }
            onMouseLeave={(e) =>
              ((e.currentTarget.style.background = "rgba(177,177,177,0.15)"))
            }
          >
            <span className="grid place-items-center !w-full !h-full leading-[0]">
              &#8249;
            </span>
          </button>

          <div className="w-full max-w-[890px] overflow-hidden">
            <div
              className="flex transition-[transform] duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {guides.map((guide) => {
                const targetBook = books.find((b) => b.id === guide.targetBookId);
                const author = authors.find((a) => a.id === guide.authorId);
                if (!targetBook || !author) return null;

                return (
                  <Link
                    to={`/guide/${guide.id}`}
                    key={guide.id}
                    className="flex-[0_0_100%]"
                  >
                    <div
                      className="box-border !p-[25px] !rounded-[20px] flex !gap-[30px] items-center"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <img
                        className="shadow-[0_10px_30px_rgba(0,0,0,0.3)] !rounded-[5px] object-cover"
                        src={targetBook.coverImg}
                        alt={`Cover of ${targetBook.title}`}
                        width={276}
                        height={387}
                        style={{ width: 276, height: 387, flexShrink: 0 }}
                      />

                      <div className="flex flex-col text-left text-white">
                        <h1 className="rg__bebas !font-normal !text-[48px] !leading-[1.1] m-0 !text-left">
                          {guide.title}
                        </h1>
                        <p className="rg__roboto m-0 !mt-[5px] !font-semibold !text-[12px] !leading-[14px] !text-left">
                          By {author.name}
                        </p>

                        <hr className="!my-[20px] w-full border-0" style={{ borderTop: "1px solid rgba(255,255,255,0.5)" }} />

                        <p className="rg__roboto m-0 !mb-[30px] !font-light !text-[20px] !leading-[1.4] !text-left">
                          {guide.excerpt}
                        </p>

                        <div
                          className="
                            inline-flex items-center justify-center gap-2
                            !px-[25px] !py-3 !rounded-[30px] border !border-[#F5F5F5]
                            cursor-pointer self-start transition-colors
                            rg__bebas !text-[18px] !leading-[22px]
                            !text-[#F5F5F5] bg-transparent
                            hover:!bg-[#F5F5F5] hover:!text-black
                          "
                        >
                          <span>VIEW READING PATH</span>
                          <span className="transition-transform">→</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            aria-label="Next book"
            onClick={handleNext}
            className="absolute !top-1/2 !-translate-y-1/2 right-0 z-10 flex !items-center !justify-center !w-[61px] !h-[61px] !rounded-full text-white !text-[2rem] backdrop-blur-[5px] transition-colors"
            style={{ background: "rgba(177,177,177,0.15)", lineHeight: 0, padding: 0, border: "none" }}
            onMouseEnter={(e) =>
              ((e.currentTarget.style.background = "rgba(177,177,177,0.3)"))
            }
            onMouseLeave={(e) =>
              ((e.currentTarget.style.background = "rgba(177,177,177,0.15)"))
            }
          >
            <span className="grid place-items-center !w-full !h-full leading-[0]">
              &#8250;
            </span>
          </button>
        </section>

        <div className="flex justify-center !gap-[10px]">
          {guides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className="!w-[15px] !h-[15px] !rounded-full transition-colors"
              style={{
                background: idx === currentIndex ? "#D9D9D9" : "#4d4d4d",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}