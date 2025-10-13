// src/data/books.ts

import type { Author as AuthorRef, Book as BookCard, ReadingGuide } from "@/types/books";

export type BookMeta = {
  id: string;
  slug: string;
  title: string;
  author: string;
  authorId: string;
  year?: number;
  cover: string;
  rating?: number;
  pages?: number;
  tags?: string[];
  description?: string;
};

/* ---------------------------
 * Authors (pakai tipe shared)
 * --------------------------- */
export const authors: AuthorRef[] = [
  { id: "auth-001", name: "Mortimer J. Adler" },
  { id: "auth-002", name: "Michel Foucault" },
  { id: "auth-003", name: "Joseph Campbell" },
  { id: "auth-004", name: "Donella Meadows" },
  { id: "auth-005", name: "Aristotle" },
  { id: "auth-006", name: "Seth Godin" },
  { id: "auth-007", name: "Lakoff & Johnson" },
  { id: "auth-008", name: "Stephen King" },
  { id: "auth-009", name: "Steven Pressfield" },
  { id: "auth-010", name: "Anne Lamott" },
  { id: "auth-011", name: "Annie Dillard" },
  { id: "auth-012", name: "D. R. Hofstadter" },
  { id: "auth-013", name: "Albert Camus" },
  { id: "auth-014", name: "Nassim N. Taleb" },
  { id: "auth-015", name: "Twyla Tharp" },
  { id: "auth-016", name: "Bayles & Orland" },
  { id: "auth-017", name: "Peter C. Brown et al." },
  { id: "auth-018", name: "Neil Postman" },
   {
    id: "auth-019",
    name: "Friedrich Nietzsche",
    image: "/assets/readingGuide/friedrich.jpg",
    bio: "Friedrich Nietzsche (1844–1900) adalah seorang filsuf Jerman, kritikus budaya, penyair, dan komponis yang memberikan pengaruh besar pada filsafat modern."
  },
];

/* ---------------------------
 * Books (data kaya / meta)
 * --------------------------- */
export const books: BookMeta[] = [
  {
    id: "b-001",
    slug: "how-to-read-a-book",
    title: "How to Read a Book",
    author: "Mortimer J. Adler",
    authorId: "auth-001",
    year: 1972,
    cover: "/assets/books/how-to-read.jpg",
    rating: 4.7,
    pages: 426,
    tags: ["reading", "method"],
    description:
      "Klasik tentang teknik membaca analitis, sintopikal, dan membangun dialog dengan teks."
  },
  {
    id: "b-002",
    slug: "discipline-and-punish",
    title: "Discipline and Punish",
    author: "Michel Foucault",
    authorId: "auth-002",
    year: 1975,
    cover: "/assets/books/discipline-punish.jpg",
    rating: 4.5,
    pages: 352,
    tags: ["philosophy", "history"]
  },
  {
    id: "b-003",
    slug: "the-hero-with-a-thousand-faces",
    title: "The Hero with a Thousand Faces",
    author: "Joseph Campbell",
    authorId: "auth-003",
    year: 1949,
    cover: "/assets/books/hero-thousand-faces.jpg",
    rating: 4.6,
    pages: 416,
    tags: ["myth", "narrative"]
  },
  {
    id: "b-004",
    slug: "thinking-in-systems",
    title: "Thinking in Systems",
    author: "Donella Meadows",
    authorId: "auth-004",
    year: 2008,
    cover: "/assets/books/thinking-in-systems.jpg",
    rating: 4.8,
    pages: 240,
    tags: ["systems", "method"]
  },
  {
    id: "b-005",
    slug: "poetics",
    title: "Poetics",
    author: "Aristotle",
    authorId: "auth-005",
    cover: "/assets/books/poetics.jpg",
    rating: 4.2,
    pages: 128,
    tags: ["classics", "aesthetics"]
  },
  {
    id: "b-006",
    slug: "the-practice",
    title: "The Practice",
    author: "Seth Godin",
    authorId: "auth-006",
    year: 2020,
    cover: "/assets/books/the-practice.jpg",
    rating: 4.4,
    pages: 272,
    tags: ["creativity", "craft"]
  },
  {
    id: "b-007",
    slug: "metaphors-we-live-by",
    title: "Metaphors We Live By",
    author: "Lakoff & Johnson",
    authorId: "auth-007",
    year: 1980,
    cover: "/assets/books/metaphors-we-live-by.jpg",
    rating: 4.5,
    pages: 256,
    tags: ["language", "cognition"]
  },
  {
    id: "b-008",
    slug: "on-writing",
    title: "On Writing",
    author: "Stephen King",
    authorId: "auth-008",
    year: 2000,
    cover: "/assets/books/on-writing.jpg",
    rating: 4.6,
    pages: 288,
    tags: ["writing", "memoir"]
  },

  {
    id: "b-009",
    slug: "the-war-of-art",
    title: "The War of Art",
    author: "Steven Pressfield",
    authorId: "auth-009",
    cover: "/assets/books/the-practice.jpg",
    tags: ["creativity", "discipline"]
  },
  {
    id: "b-010",
    slug: "bird-by-bird",
    title: "Bird by Bird",
    author: "Anne Lamott",
    authorId: "auth-010",
    cover: "/assets/books/on-writing.jpg",
    tags: ["writing", "craft"]
  },
  {
    id: "b-011",
    slug: "the-writing-life",
    title: "The Writing Life",
    author: "Annie Dillard",
    authorId: "auth-011",
    cover: "/assets/books/on-writing.jpg",
    tags: ["writing", "process"]
  },
  {
    id: "b-012",
    slug: "godel-escher-bach",
    title: "Gödel, Escher, Bach",
    author: "D. R. Hofstadter",
    authorId: "auth-012",
    cover: "/assets/books/thinking-in-systems.jpg",
    tags: ["systems", "cognition"]
  },
  {
    id: "b-013",
    slug: "the-myth-of-sisyphus",
    title: "The Myth of Sisyphus",
    author: "Albert Camus",
    authorId: "auth-013",
    cover: "/assets/books/poetics.jpg",
    tags: ["existentialism", "essay"]
  },
  {
    id: "b-014",
    slug: "antifragile",
    title: "Antifragile",
    author: "Nassim N. Taleb",
    authorId: "auth-014",
    cover: "/assets/books/thinking-in-systems.jpg",
    tags: ["risk", "systems"]
  },
  {
    id: "b-015",
    slug: "the-creative-habit",
    title: "The Creative Habit",
    author: "Twyla Tharp",
    authorId: "auth-015",
    cover: "/assets/books/the-practice.jpg",
    tags: ["creativity", "practice"]
  },
  {
    id: "b-016",
    slug: "art-and-fear",
    title: "Art & Fear",
    author: "Bayles & Orland",
    authorId: "auth-016",
    cover: "/assets/books/the-practice.jpg",
    tags: ["creativity", "fear"]
  },
  {
    id: "b-017",
    slug: "make-it-stick",
    title: "Make It Stick",
    author: "Peter C. Brown et al.",
    authorId: "auth-017",
    cover: "/assets/books/how-to-read.jpg",
    tags: ["learning", "memory"]
  },
  {
    id: "b-018",
    slug: "amusing-ourselves-to-death",
    title: "Amusing Ourselves to Death",
    author: "Neil Postman",
    authorId: "auth-018",
    cover: "/assets/books/metaphors-we-live-by.jpg",
    tags: ["media", "culture"]
  },
  {
    id: "b-025",
    slug: "ecce-homo",
    title: "ECCE HOMO",
    author: "Friedrich Nietzsche",
    authorId: "auth-019",
    cover: "/assets/readingGuide/Ecce Homo.jpeg",
    description: "Sebuah otobiografi filosofis yang provokatif dan introspektif."
  },
  {
    id: "b-026",
    slug: "thus-spoke-zarathustra",
    title: "THUS SPOKE ZARATHUSTRA",
    author: "Friedrich Nietzsche",
    authorId: "auth-019",
    cover: "/assets/readingGuide/Thus Spoke Zarathustra.jpeg",
    description: "Novel alegoris yang memperkenalkan konsep-konsep sentral Nietzsche."
  },
  {
    id: "b-028",
    slug: "beyond-good-and-evil",
    title: "BEYOND GOOD AND EVIL",
    author: "Friedrich Nietzsche",
    authorId: "auth-019",
    cover: "/assets/readingGuide/cc68a255-f8b0-4d15-9798-e0e5ac96320f.jpeg",
    description: "Kritik tajam terhadap tradisi filsafat dan moralitas Barat."
  },
  
];

/* ---------------------------
 * Reading Guides (pakai tipe shared)
 * --------------------------- */
export const guides: ReadingGuide[] = [
  {
    id: "rg-001",
    targetBookId: "b-001",
    title: "How to Read Deeply",
    excerpt:
      "Bangun kebiasaan membaca yang lebih dalam: dari inspeksi cepat ke analitis dan sintopikal.",
    authorId: "auth-001",
    steps: [{ bookId: "b-001" }, { bookId: "b-017" }, { bookId: "b-004" }],
  },
  {
    id: "rg-002",
    targetBookId: "b-004",
    title: "Systems Thinking Starter Pack",
    excerpt:
      "Memetakan pola, umpan balik, dan ketahanan—cara melihat dunia sebagai sistem.",
    authorId: "auth-004",
    steps: [{ bookId: "b-004" }, { bookId: "b-014" }, { bookId: "b-012" }],
  },
  {
    id: "rg-003",
    targetBookId: "b-003",
    title: "Myth & Form",
    excerpt:
      "Memahami bentuk-bentuk naratif yang berulang dan mengapa ia terus memikat budaya populer.",
    authorId: "auth-003",
    steps: [{ bookId: "b-003" }, { bookId: "b-005" }],
  },
  {
    id: "rg-004",
    targetBookId: "b-006",
    title: "Creative Practice Track",
    excerpt:
      "Rangkaian praktik kreatif harian—bergerak melampaui motivasi menuju disiplin.",
    authorId: "auth-006",
    steps: [
      { bookId: "b-006" },
      { bookId: "b-009" },
      { bookId: "b-015" },
      { bookId: "b-016" },
    ],
  },
  {
    id: "rg-005",
    targetBookId: "b-008",
    title: "Writing Craft Essentials",
    excerpt:
      "Membangun kebiasaan menulis yang tahan lama: proses, draf buruk pertama, dan ketekunan.",
    authorId: "auth-008",
    steps: [{ bookId: "b-008" }, { bookId: "b-010" }, { bookId: "b-011" }],
  },
  {
    id: "rg-006",
    targetBookId: "b-007",
    title: "Language, Media, Power",
    excerpt:
      "Bahasa membentuk pikiran; media membentuk masyarakat. Lintasan ringkas untuk melihat pengaruhnya.",
    authorId: "auth-007",
    steps: [{ bookId: "b-007" }, { bookId: "b-018" }, { bookId: "b-002" }],
  },
  {
    id: "rg-007",
    targetBookId: "b-013",
    title: "Existential Notes",
    excerpt:
      "Menemukan kejernihan di tengah absurditas: dari Sisyphus ke rezim disiplin modern.",
    authorId: "auth-013",
    steps: [{ bookId: "b-013" }, { bookId: "b-002" }],
  },
  {
    id: "rg-008",
    targetBookId: "b-012",
    title: "Strange Loops & Systems",
    excerpt:
      "Eksplorasi lingkaran umpan balik, rekursi, dan struktur yang menyeberang disiplin.",
    authorId: "auth-012",
    steps: [{ bookId: "b-012" }, { bookId: "b-014" }],
  },
  {
    id: "rg-009",
    targetBookId: "b-015",
    title: "Make More, Fear Less",
    excerpt:
      "Produksi lebih banyak dengan kecemasan lebih sedikit—ritme kerja kreatif yang berkelanjutan.",
    authorId: "auth-015",
    steps: [{ bookId: "b-015" }, { bookId: "b-009" }, { bookId: "b-016" }],
  },
  {
    id: "rg-010",
    targetBookId: "b-025",
    title: "Ecce Homo Reading Path",
    excerpt:
      "Panduan ini membawa Anda melalui beberapa karya kunci Nietzsche sebagai konteks menuju Ecce Homo.",
    authorId: "auth-019",
    steps: [{ bookId: "b-026" }, { bookId: "b-028" }]
  },
];

/* ---------------------------
 * Mappers & Helpers
 * --------------------------- */

export function toBookCard(b: BookMeta): BookCard {
  return {
    id: b.id,
    authorId: b.authorId,
    title: b.title,
    coverImg: b.cover,
    description: b.description,
  };
}

export function mapBooksToRelatedCards(src: BookMeta[]): BookCard[] {
  return src.map(toBookCard);
}

export function relatedBooksByAuthor(
  authorId: string | number,
  excludeBookId?: string | number
): BookCard[] {
  const filtered = books.filter((b) => b.authorId === String(authorId) && b.id !== excludeBookId);
  return filtered.map(toBookCard);
}

export default books;