// src/features/reading-guide/components/ReadingGuideCollectionSection.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  books as centerBooksRaw,
  authors as centerAuthors,
  guides as centerGuides,
} from "@/data/books";

type GridBook = {
  id: string;
  title: string;
  coverImg: string;
  authorId: string;
};

type Props = {
  books?: GridBook[];
  initialCount?: number;
};

const centerBooks: GridBook[] = centerBooksRaw.map((b) => ({
  id: b.id,
  title: b.title,
  coverImg: b.cover,
  authorId: b.authorId,
}));

export default function ReadingGuideCollectionSection({
  books = centerBooks,
  initialCount = 15,
}: Props) {
  const authors = centerAuthors;
  const guides = centerGuides;

  const [isExpanded, setIsExpanded] = useState(false);

  const visibleBooks = isExpanded ? books : books.slice(0, initialCount);
  const canLoadMore = !isExpanded && books.length > initialCount;

  const findGuideForBook = (bookId: string) => {
    const g = guides.find(
      (x) => x.targetBookId === bookId || x.steps.some((s) => s.bookId === bookId)
    );
    return g ? g.id : null;
  };

  return (
    <section className="w-full bg-black text-white py-[60px]">
      <div className="max-w-[1241px] mx-auto px-5">
        <header className="border-t border-white pt-5 mb-[30px]">
          <h2
            className="m-0 text-left"
            style={{
              fontFamily: '"Bebas Neue", cursive',
              fontWeight: 400,
              fontSize: 48,
              lineHeight: "58px",
            }}
          >
            COLLECTED BOOKS
          </h2>
        </header>

        <div className="box-border flex items-center gap-2 w-full max-w-[423px] h-[46px] mx-auto mb-[50px] px-[15px] bg-black border border-white rounded-[20px]">
          <div className="relative w-[18px] h-[18px] rounded-full border-2 border-white shrink-0">
            <span
              className="absolute block"
              style={{
                width: 8,
                height: 2,
                background: "#fff",
                bottom: -4,
                right: -4,
                transform: "rotate(45deg)",
              }}
            />
          </div>
          <input
            type="text"
            placeholder="what are you looking for..."
            className="w-full bg-transparent outline-none border-none"
            style={{ fontFamily: '"Roboto", sans-serif', fontSize: 16, color: "#fff" }}
          />
        </div>

        <div className="relative">
          <div
            className="rgc-grid grid gap-y-[40px] gap-x-[30px] overflow-hidden transition-[max-height] duration-700 ease-in-out"
            style={{
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              maxHeight: isExpanded ? 5000 : 1050,
            }}
          >
            {visibleBooks.map((book) => {
              const guideId = findGuideForBook(book.id);
              const author = authors.find((a) => a.id === book.authorId);

              return (
                <Link
                  key={book.id}
                  to={guideId ? `/guide/${guideId}` : "#"}
                  className="rgc-book-link block text-inherit no-underline"
                >
                  <article className="flex flex-col text-center">
                    <div
                      className="w-full mb-[15px] bg-center bg-cover"
                      style={{
                        aspectRatio: "157 / 220",
                        backgroundImage: `url(${book.coverImg})`,
                      }}
                      aria-label={book.title}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <h3
                        className="m-0"
                        style={{
                          fontFamily: '"Bebas Neue", cursive',
                          fontSize: 28,
                          lineHeight: 1.1,
                          color: "#fff",
                        }}
                      >
                        {book.title}
                      </h3>
                      <p
                        className="m-0"
                        style={{
                          fontFamily: '"Roboto", sans-serif',
                          fontWeight: 600,
                          fontSize: 12,
                          lineHeight: "14px",
                        }}
                      >
                        By {author ? author.name : "Unknown"}
                      </p>

                      <div
                        className="inline-flex justify-center items-center mt-[5px] px-[28px] py-3 border border-[#F5F5F5] rounded-[30px] cursor-pointer transition-colors"
                        style={{
                          fontFamily: '"Bebas Neue", cursive',
                          fontSize: 18,
                          lineHeight: "20px",
                          color: "#F5F5F5",
                          background: "none",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.backgroundColor = "#F5F5F5";
                          (e.currentTarget as HTMLDivElement).style.color = "#000";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.backgroundColor = "transparent";
                          (e.currentTarget as HTMLDivElement).style.color = "#F5F5F5";
                        }}
                      >
                        READING GUIDE
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {canLoadMore && (
            <div
              className="absolute left-0 bottom-0 w-full flex justify-center items-center z-[5] pointer-events-none"
              style={{
                height: 200,
                background:
                  "linear-gradient(0deg, #000000 16.35%, rgba(0,0,0,0) 100%)",
              }}
            >
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="pointer-events-auto bg-transparent border-0 cursor-pointer"
                style={{
                  fontFamily: '"Bebas Neue", cursive',
                  fontWeight: 400,
                  fontSize: 42,
                  lineHeight: "48px",
                  letterSpacing: "0.05em",
                  color: "#FFFFFF",
                  transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget.style.opacity = "0.8"))}
                onMouseLeave={(e) => ((e.currentTarget.style.opacity = "1"))}
              >
                LOAD MORE...
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 1200px) {
          .rgc-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        }
        @media (max-width: 992px) {
          .rgc-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 768px) {
          .rgc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
      `}</style>
    </section>
  );
}