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
  const [overlayVisible, setOverlayVisible] = useState(books.length > initialCount);

  const visibleBooks = isExpanded ? books : books.slice(0, initialCount);
  const canLoadMore = !isExpanded && books.length > initialCount;

  const findGuideForBook = (bookId: string) => {
    const g = guides.find(
      (x) => x.targetBookId === bookId || x.steps.some((s) => s.bookId === bookId)
    );
    return g ? g.id : null;
  };

  const handleLoadMore = () => {
    setIsExpanded(true);
    requestAnimationFrame(() => {
      setOverlayVisible(false);
    });
  };

  return (
    <section className="w-full bg-black text-white !py-[60px]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto:wght@400;600&display=swap');
        .rg__bebas { font-family: 'Bebas Neue', cursive !important; }
        .rg__roboto { font-family: 'Roboto', sans-serif !important; }

        /* LOAD MORE overlay & button: disamakan dengan ResearchArticlesSection */
        .rs__loadwrap {
          position: absolute !important;
          left: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          height: 150px !important;
          display: flex !important;
          justify-content: center !important;
          align-items: flex-end !important;
          background: linear-gradient(0deg, #000000 16.35%, rgba(0,0,0,0) 100%) !important;
          z-index: 5 !important;
          pointer-events: none !important;
          padding-bottom: 2rem !important;
          opacity: 1 !important;
          visibility: visible !important;
          transition: opacity .35s ease, visibility 0s linear 0s !important;
        }
        .rs__loadwrap--hidden {
          opacity: 0 !important;
          visibility: hidden !important;
          transition: opacity .35s ease, visibility 0s linear .35s !important;
        }
        .rs__loadbtn {
          font-family: 'Bebas Neue', cursive !important;
          font-size: 42px !important;
          letter-spacing: .05em !important;
          color: #FFFFFF !important;
          background: none !important;
          border: none !important;
          cursor: pointer !important;
          transition: opacity .3s ease !important;
          pointer-events: all !important;
          outline: none !important;
          box-shadow: none !important;
          -webkit-tap-highlight-color: transparent !important;
          appearance: none !important;
        }
        .rs__loadbtn:hover { opacity: .8 !important; }
      `}</style>

      <div className="max-w-[1241px] mx-auto px-5">
        <header className="border-t border-white !pt-5 !mb-[30px]">
          <h2 className="rg__bebas !font-normal !text-[48px] !leading-[58px] text-left m-0">
            COLLECTED BOOKS
          </h2>
        </header>

        <div className="box-border flex items-center gap-2 w-full max-w-[423px] !h-[46px] mx-auto !mb-[50px] px-[15px] bg-black border border-white !rounded-[20px]">
          <div className="relative !w-[18px] !h-[18px] rounded-full border-2 border-white shrink-0">
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
            className="w-full bg-transparent outline-none border-none rg__roboto !text-[16px] !text-white placeholder:!text-white/50"
          />
        </div>

        <div className="relative">
          <div
            className="rgc-grid grid overflow-hidden transition-[max-height] duration-700 ease-in-out !gap-y-[40px] !gap-x-[30px]"
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
                      className="w-full !mb-[15px] bg-center bg-cover"
                      style={{
                        aspectRatio: "157 / 220",
                        backgroundImage: `url(${book.coverImg})`,
                      }}
                      aria-label={book.title}
                    />
                    <div className="flex flex-col items-center !gap-2">
                      <h3 className="rg__bebas m-0 !text-[28px] !leading-[1.1] text-white">
                        {book.title}
                      </h3>
                      <p className="rg__roboto m-0 !font-semibold !text-[12px] !leading-[14px]">
                        By {author ? author.name : "Unknown"}
                      </p>

                      <div
                        className="
                          inline-flex justify-center items-center
                          !mt-[5px] !px-[28px] !py-3 border !border-[#F5F5F5] !rounded-[30px]
                          cursor-pointer transition-colors
                          rg__bebas !text-[18px] !leading-[20px]
                          !text-[#F5F5F5] bg-transparent
                          hover:!bg-[#F5F5F5] hover:!text-black
                        "
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
              className={[
                "rs__loadwrap",
                overlayVisible ? "" : "rs__loadwrap--hidden",
              ].join(" ")}
              aria-hidden={!overlayVisible}
            >
              {!isExpanded && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="rs__loadbtn"
                >
                  LOAD MORE...
                </button>
              )}
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