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
        <h1
          className="relative z-[2] uppercase text-center"
          style={{ fontFamily: '"Bebas Neue", cursive', fontSize: "5rem" }}
        >
          READING GUIDE
        </h1>
      </section>

      <div className="bg-black flex flex-col items-center py-[60px]">
        <section className="relative w-full max-w-[1100px] flex items-center justify-center mb-[30px]">
          <img
            src="/assets/readingGuide/Group 5185.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none opacity-50 absolute z-[5]"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              height: 700,
              left: -420,
            }}
          />
          <img
            src="/assets/readingGuide/Group 5184.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none opacity-50 absolute z-[5]"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              height: 700,
              right: -499,
            }}
          />

          <button
            type="button"
            aria-label="Previous book"
            onClick={handlePrev}
            className="absolute top-1/2 -translate-y-1/2 left-0 z-10 flex items-center justify-center"
            style={{
              width: 61,
              height: 61,
              borderRadius: "50%",
              background: "rgba(177,177,177,0.15)",
              color: "#fff",
              fontSize: "2rem",
              backdropFilter: "blur(5px)",
              transition: "background-color 0.3s",
              boxSizing: "border-box",
              padding: 0,
              lineHeight: 0,
              border: "none",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget.style.background = "rgba(177,177,177,0.3)"))
            }
            onMouseLeave={(e) =>
              ((e.currentTarget.style.background = "rgba(177,177,177,0.15)"))
            }
          >
            &#8249;
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
                      className="box-border p-[25px] rounded-[20px] flex gap-[30px] items-center"
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <img
                        className="shadow-[0_10px_30px_rgba(0,0,0,0.3)] rounded-[5px] object-cover"
                        src={targetBook.coverImg}
                        alt={`Cover of ${targetBook.title}`}
                        width={276}
                        height={387}
                        style={{ width: 276, height: 387, flexShrink: 0 }}
                      />
                      <div className="flex flex-col text-left">
                        <h1
                          className="m-0"
                          style={{
                            fontFamily: '"Bebas Neue", cursive',
                            fontWeight: 400,
                            fontSize: 48,
                            lineHeight: 1.1,
                          }}
                        >
                          {guide.title}
                        </h1>
                        <p
                          className="m-0 mt-[5px]"
                          style={{
                            fontFamily: '"Roboto", sans-serif',
                            fontWeight: 600,
                            fontSize: 12,
                            lineHeight: "14px",
                          }}
                        >
                          By {author.name}
                        </p>

                        <hr
                          className="my-[20px] w-full border-0"
                          style={{ borderTop: "1px solid rgba(255,255,255,0.5)" }}
                        />

                        <p
                          className="m-0 mb-[30px]"
                          style={{
                            fontFamily: '"Roboto", sans-serif',
                            fontWeight: 300,
                            fontSize: 20,
                            lineHeight: 1.4,
                          }}
                        >
                          {guide.excerpt}
                        </p>

                        <div
                          className="inline-flex items-center justify-center gap-2 px-[25px] py-3 rounded-[30px] border border-[#F5F5F5] cursor-pointer self-start transition-colors"
                          style={{
                            background: "none",
                            color: "#F5F5F5",
                            fontFamily: '"Bebas Neue", cursive',
                            fontSize: 18,
                            lineHeight: "22px",
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#F5F5F5";
                            e.currentTarget.style.color = "#000";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#F5F5F5";
                          }}
                        >
                          <span>VIEW READING PATH</span> <span>→</span>
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
            className="absolute top-1/2 -translate-y-1/2 right-0 z-10 flex items-center justify-center"
            style={{
              width: 61,
              height: 61,
              borderRadius: "50%",
              background: "rgba(177,177,177,0.15)",
              color: "#fff",
              fontSize: "2rem",
              backdropFilter: "blur(5px)",
              transition: "background-color 0.3s",
              boxSizing: "border-box",
              padding: 0,
              lineHeight: 0,
              border: "none",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget.style.background = "rgba(177,177,177,0.3)"))
            }
            onMouseLeave={(e) =>
              ((e.currentTarget.style.background = "rgba(177,177,177,0.15)"))
            }
          >
            &#8250;
          </button>
        </section>

        <div className="flex justify-center gap-[10px]">
          {guides.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className="rounded-full transition-colors"
              style={{
                width: 15,
                height: 15,
                background: idx === currentIndex ? "#D9D9D9" : "#4d4d4d",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}