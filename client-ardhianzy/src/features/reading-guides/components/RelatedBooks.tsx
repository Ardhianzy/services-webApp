// src/features/reading-guides/components/RelatedBooks.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Book as RelatedBookCard } from "@/types/books";
import { relatedBooksByAuthor } from "@/data/books";

const CARD_WIDTH = 299;
const CARD_GAP = 30;
const GRADIENT_W = 50;
const HEADER_BAR_W = 13;
const HEADER_BAR_H = 77;
const DESC_PREVIEW = 100;

type Props = {
  books?: RelatedBookCard[];
  authorId?: string | number;
  currentBookId?: string | number;
  title?: string;
};

export default function RelatedBooks({
  books,
  authorId,
  currentBookId,
  title = "OTHER BOOKS BY THIS AUTHOR",
}: Props) {
  const cards: RelatedBookCard[] | null = useMemo(() => {
    if (books && books.length) return books;
    if (authorId) return relatedBooksByAuthor(authorId, currentBookId);
    return null;
  }, [books, authorId, currentBookId]);

  const [currentPage, setCurrentPage] = useState(0);
  if (!cards || cards.length === 0) return null;

  const booksPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(cards.length / booksPerPage));
  const slideWidth = CARD_WIDTH * booksPerPage + CARD_GAP * (booksPerPage - 1);

  const handleNext = () => setCurrentPage((p) => (p + 1) % totalPages);
  const handlePrev = () => setCurrentPage((p) => (p === 0 ? totalPages - 1 : p - 1));

  return (
    <section
      className="w-full bg-black text-white py-20 overflow-hidden"
      role="region"
      aria-label="Related books"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@300;400;600&display=swap');
      `}</style>

      <div className="max-w-[1275px] mx-auto px-5">
        <header className="flex items-center gap-5 mb-10 ml-0">
          <div
            className="bg-white"
            style={{ width: HEADER_BAR_W, height: HEADER_BAR_H }}
            aria-hidden="true"
          />
          <h2
            className="m-0"
            style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 64, lineHeight: "77px" }}
          >
            {title}
          </h2>
        </header>

        <div className="relative" aria-roledescription="carousel">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-20"
            style={{
              width: GRADIENT_W,
              background: "linear-gradient(to right, #000 20%, rgba(0,0,0,0) 100%)",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-20"
            style={{
              width: GRADIENT_W,
              background: "linear-gradient(to left, #000 20%, rgba(0,0,0,0) 100%)",
            }}
            aria-hidden="true"
          />

          {totalPages > 1 && (
            <button
              type="button"
              aria-label="Previous Books"
              onClick={handlePrev}
              className="absolute top-1/2 -translate-y-1/2 left-[-50px] w-[50px] h-[50px] rounded-full border-0 flex items-center justify-center text-[#F5F5F5] text-[2rem] font-light z-30 transition-colors"
              style={{ background: "rgba(177,177,177,0.2)", lineHeight: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(177,177,177,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(177,177,177,0.2)")}
            >
              &#8249;
            </button>
          )}

          <div className="overflow-hidden w-full">
            <div
              className="flex"
              style={{
                gap: CARD_GAP,
                transform: `translateX(-${currentPage * slideWidth}px)`,
                transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              aria-live="polite"
            >
              {cards.map((book) => {
                const preview = (book.description ?? "").substring(0, DESC_PREVIEW);
                return (
                  <article
                    key={book.id}
                    className="flex-shrink-0 text-center flex flex-col"
                    style={{ width: CARD_WIDTH }}
                  >
                    <img
                      src={book.coverImg}
                      alt={book.title}
                      className="w-full h-[194px] object-cover object-top grayscale mb-[15px]"
                      loading="lazy"
                    />
                    <div className="flex flex-col items-center gap-2 flex-grow px-[10px]">
                      <h3
                        className="m-0"
                        style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, lineHeight: 1.1 }}
                      >
                        {book.title}
                      </h3>
                      <p
                        className="mb-auto overflow-hidden"
                        style={{
                          fontFamily: "'Roboto', sans-serif",
                          fontSize: 14,
                          lineHeight: 1.4,
                          height: "4.2em",
                        }}
                      >
                        {preview}...
                      </p>
                      <Link
                        to="/"
                        className="flex items-center gap-[5px] underline text-white"
                        style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 600, fontSize: 15, marginTop: 15 }}
                      >
                        View Details <span className="inline-block">→</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {totalPages > 1 && (
            <button
              type="button"
              aria-label="Next Books"
              onClick={handleNext}
              className="absolute top-1/2 -translate-y-1/2 right-[-50px] w-[50px] h-[50px] rounded-full border-0 flex items-center justify-center text-[#F5F5F5] text-[2rem] font-light z-30 transition-colors"
              style={{ background: "rgba(177,177,177,0.2)", lineHeight: 0 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(177,177,177,0.4)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(177,177,177,0.2)")}
            >
              &#8250;
            </button>
          )}
        </div>
      </div>
    </section>
  );
}