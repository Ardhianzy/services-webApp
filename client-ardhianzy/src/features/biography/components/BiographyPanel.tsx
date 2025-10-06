// src/features/philosophers/components/BiographyPanel.tsx
import { books as centerBooks } from "@/data/books";

type BookCard = { cover: string; title?: string };

export type Philosopher = {
  id: string | number;
  name: string;
  image: string;
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  descript?: string;
  books?: BookCard[];
  bookIds?: string[];
};

type BiographyPanelProps = {
  philosopher?: Philosopher | null;
  onClose?: () => void;
};

function PhilosophyDiagram() {
  return (
    <div className="w-full max-w-[280px]">
      <svg viewBox="-10 -20 220 235" className="h-auto w-full" overflow="visible">
        <polygon points="100,20 190,180 10,180" fill="none" stroke="#fff" strokeWidth="1" />
        <polygon
          points="100,60 150,140 50,140"
          fill="none"
          stroke="#fff"
          strokeWidth="0.5"
          strokeDasharray="2,2"
        />
        <polygon points="100,88 125,125 75,125" fill="none" stroke="#fff" strokeWidth="0.5" />

        <circle cx="100" cy="20" r="16.5" fill="#FFFFFF" />
        <circle cx="10" cy="180" r="16.5" fill="#FFFFFF" />
        <circle cx="190" cy="180" r="16.5" fill="#FFFFFF" />

        <image href="/assets/logo1.svg" x="85" y="5" width="30" height="30" />
        <image href="/assets/logo3.svg" x="-5" y="165" width="30" height="30" />
        <image
          href="/assets/Screenshot_2025-07-11_at_23.25.03-removebg-preview 1.svg"
          x="175"
          y="165"
          width="30"
          height="30"
        />

        <text
          x="100"
          y="-4"
          fill="#fff"
          fontFamily="Roboto, Arial, sans-serif"
          fontSize="11"
          fontWeight={500}
          textAnchor="middle"
        >
          METAFISIKA
        </text>
        <text
          x="20"
          y="210"
          fill="#fff"
          fontFamily="Roboto, Arial, sans-serif"
          fontSize="11"
          fontWeight={500}
          textAnchor="middle"
        >
          EPISTEMOLOGI
        </text>
        <text
          x="190"
          y="210"
          fill="#fff"
          fontFamily="Roboto, Arial, sans-serif"
          fontSize="11"
          fontWeight={500}
          textAnchor="middle"
        >
          AKSIOLOGI
        </text>
      </svg>
    </div>
  );
}

export default function BiographyPanel({ philosopher, onClose }: BiographyPanelProps) {
  if (!philosopher) return null;

  const booksFromIds: BookCard[] =
    (philosopher.bookIds ?? [])
      .map((id) => centerBooks.find((b) => b.id === id))
      .filter(Boolean)
      .map((b) => ({ cover: (b as any).cover, title: (b as any).title })) as BookCard[];

  const books: BookCard[] =
    philosopher.books?.length ? philosopher.books : booksFromIds.length ? booksFromIds : [
      { cover: "https://via.placeholder.com/97x144.png?text=Ecce+Homo", title: "Ecce Homo" },
      { cover: "https://via.placeholder.com/97x144.png?text=Zarathustra", title: "Thus Spoke Zarathustra" },
      { cover: "https://via.placeholder.com/97x144.png?text=Beyond+Good+and+Evil", title: "Beyond Good and Evil" },
      { cover: "https://via.placeholder.com/97x144.png?text=Sample+Book", title: "Sample Book" },
    ];

  return (
    <>
      <div className="biography-scroll relative h-full w-full overflow-y-auto bg-black text-white">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close biography"
          className="absolute -right-[15px] -top-[15px] z-10 cursor-pointer bg-transparent text-[36px] font-light leading-none text-white"
        >
          &times;
        </button>

        <div
          aria-hidden
          className="absolute left-0 top-0 z-[1] h-[261px] w-full"
          style={{ background: "radial-gradient(130.84% 63.6% at 50% 0%, #505050 0%, #000000 100%)" }}
        />

        <div className="relative z-[2] flex items-center gap-[30px] pt-[50px] pr-[30px] pb-[20px] pl-[30px]">
          <div className="h-[360px] w-[270px] shrink-0">
            <img
              src={philosopher.image}
              alt={philosopher.name}
              className="h-full w-full rounded-br-[40px] object-cover opacity-80"
            />
          </div>

          <div className="flex w-full flex-col items-center">
            <h1 className="m-0 mb-[15px] text-center font-['Bebas Neue'] text-[48px] font-[400]">
              {philosopher.name?.toUpperCase()}
            </h1>
            <PhilosophyDiagram />
          </div>
        </div>

        <div className="px-[40px] py-[30px]">
          <div className="mb-[5px] flex items-center justify-start gap-[10px] font-['Bebas Neue'] text-[35px]">
            <span>{philosopher.birthDate || "15 OCT 1844"}</span>
            <span className="h-[2px] w-[10px] bg-white" />
            <span>{philosopher.deathDate || "25 AUG 1900"}</span>
          </div>

          <div className="mb-[30px] flex justify-start gap-[40px] text-[12px] font-light text-white/50">
            <span>{philosopher.birthPlace || "Röcken, Lützen, Jerman"}</span>
            <span>{philosopher.deathPlace || "Weimar, Jerman"}</span>
          </div>

          <section className="mb-[30px]">
            <h2 className="mb-[15px] text-left text-[22px] font-bold">Deskripsi</h2>
            <p className="text-justify text-[14px] font-light leading-[1.6] text-white/90">
              {philosopher.descript || "Data deskripsi tidak tersedia."}
            </p>
          </section>

          {books.length > 0 && (
            <section className="mb-[30px]">
              <h2 className="mb-[15px] text-left text-[22px] font-bold">Books</h2>
              <div className="flex flex-wrap justify-start gap-[20px]">
                {books.map((book, idx) => (
                  <div key={`${book.cover}-${idx}`} className="w-[120px] text-center">
                    <img
                      src={book.cover}
                      alt={book.title ? book.title : `Buku ${idx + 1}`}
                      className="mb-2 h-[178px] w-full object-cover"
                    />
                    {book.title && <p className="m-0 font-['Bebas Neue'] text-[15px]">{book.title}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <style>{`
        .biography-scroll::-webkit-scrollbar { width: 8px; }
        .biography-scroll::-webkit-scrollbar-track { background: #000; }
        .biography-scroll::-webkit-scrollbar-thumb { background-color: #505050; border-radius: 10px; }
      `}</style>
    </>
  );
}