import { useParams, useNavigate } from "react-router-dom";
import RelatedBooks from "@/features/reading-guides/components/RelatedBooks";
import * as BooksData from "@/data/books";

import type { ReadingGuide as ReadingGuideType } from "@/types/books";
import type { Author as AuthorRef, Book as BookCard } from "@/types/books";
import type { BookMeta } from "@/data/books";

export default function GuidePage() {
  const { guideId } = useParams<{ guideId: string }>();
  const navigate = useNavigate();

  const guides: ReadingGuideType[] = (BooksData as any).guides ?? [];
  const authors: AuthorRef[] = (BooksData as any).authors ?? [];
  const booksMeta: BookMeta[] = (BooksData as any).books ?? [];

  const bookCards: BookCard[] = booksMeta.map(BooksData.toBookCard);

  const guide = guides.find((g) => String(g.id) === String(guideId));

  if (!guide) {
    return (
      <main className="bg-black text-white pt-[240px] pb-[80px] min-h-screen">
        <div className="max-w-[1440px] mx-auto bg-[rgba(217,217,217,0.1)] rounded-[20px] p-10">
          <h1>Panduan Tidak Ditemukan</h1>
        </div>
      </main>
    );
  }

  const author = authors.find((a) => String(a.id) === String(guide.authorId));
  const targetBook = bookCards.find((b) => String(b.id) === String(guide.targetBookId));

  const booksInGuideIds = [
    String(guide.targetBookId),
    ...guide.steps.map((s) => String(s.bookId)),
  ];

  const relatedBooks = bookCards.filter(
    (b) => String(b.authorId) === String(guide.authorId) && !booksInGuideIds.includes(String(b.id))
  );

  if (!author || !targetBook) {
    return (
      <main className="bg-black text-white pt-[240px] pb-[80px] min-h-screen">
        <div className="max-w-[1440px] mx-auto bg-[rgba(217,217,217,0.1)] rounded-[20px] p-10">
          <h1>Data tidak lengkap untuk panduan ini.</h1>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="bg-black text-white pt-[240px] pb-[80px] min-h-screen">
        <div className="max-w-[1440px] mx-auto bg-[rgba(217,217,217,0.1)] rounded-[20px] p-10">
          <button
            onClick={() => navigate(-1)}
            className="bg-transparent border-0 text-white cursor-pointer mb-5 block"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: 16 }}
          >
            ← Back
          </button>

          <div
            className="grid gap-[30px] items-start max-[1200px]:grid-cols-1"
            style={{ gridTemplateColumns: "580px 1fr" }}
          >
            <aside className="flex flex-col gap-[30px]">
              <div className="flex gap-5 p-5 bg-[rgba(255,255,255,0.1)] rounded-[20px]">
                {"image" in author && (author as any).image ? (
                  <img
                    src={(author as any).image as string}
                    alt={author.name}
                    className="w-[150px] h-[180px] object-cover rounded-[12px] shrink-0"
                  />
                ) : null}

                <div className="author-details">
                  <h2
                    className="m-0 mb-[10px]"
                    style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20 }}
                  >
                    {author.name}
                  </h2>

                  {"bio" in author && (author as any).bio ? (
                    <p
                      className="text-justify text-[#dddddd]"
                      style={{ fontFamily: "'Roboto', sans-serif", fontSize: 16, lineHeight: 1.4 }}
                    >
                      {(author as any).bio as string}
                    </p>
                  ) : null}
                </div>
              </div>

              <img
                src={targetBook.coverImg}
                alt={targetBook.title}
                className="w-full h-auto rounded-[16px]"
              />
            </aside>

            <section className="bg-[rgba(114,106,106,0.15)] rounded-[20px] p-[25px]">
              <h2
                className="m-0 pb-5 border-b border-white text-left"
                style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48 }}
              >
                LIST BOOKS
              </h2>

              <div className="flex gap-[15px] p-5 my-[30px] bg-[rgba(255,255,255,0.1)] rounded-[20px]">
                <span className="text-[24px]">⚠️</span>
                <div className="warning-text">
                  <h3
                    className="m-0 mb-[5px] text-left"
                    style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 20 }}
                  >
                    WARNING:
                  </h3>
                  <p
                    className="m-0 text-left text-[#dddddd]"
                    style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, lineHeight: 1.3 }}
                  >
                    Do not read this book randomly or skip sections...
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-[25px]">
                {guide.steps.map((step, idx) => {
                  const stepBook = bookCards.find((b) => String(b.id) === String(step.bookId));
                  if (!stepBook) return null;

                  const order = (step as any).order ?? idx + 1;

                  return (
                    <div
                      className="flex items-center gap-5 p-5 bg-[rgba(255,255,255,0.1)] rounded-[20px]"
                      key={`${order}-${stepBook.id}`}
                    >
                      <img
                        src={stepBook.coverImg}
                        alt={stepBook.title}
                        className="w-[120px] h-auto shrink-0"
                      />
                      <div className="path-book-details">
                        <h3
                          className="m-0 mb-[10px]"
                          style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 40, lineHeight: 1.1 }}
                        >
                          {stepBook.title}
                        </h3>
                        {stepBook.description ? (
                          <p
                            className="text-[#dddddd]"
                            style={{ fontFamily: "'Roboto', sans-serif", fontSize: 16, lineHeight: 1.4 }}
                          >
                            {stepBook.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center gap-5 p-5 bg-[rgba(255,255,255,0.1)] rounded-[20px]">
                  <img
                    src={targetBook.coverImg}
                    alt={targetBook.title}
                    className="w-[120px] h-auto shrink-0"
                  />
                  <div>
                    <h3
                      className="m-0 mb-[10px]"
                      style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 40, lineHeight: 1.1 }}
                    >
                      {targetBook.title}
                    </h3>
                    {targetBook.description ? (
                      <p
                        className="text-[#dddddd]"
                        style={{ fontFamily: "'Roboto', sans-serif", fontSize: 16, lineHeight: 1.4 }}
                      >
                        {targetBook.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <RelatedBooks books={relatedBooks} />
    </>
  );
}