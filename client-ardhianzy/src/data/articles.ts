// Centralized article dummy data for: Home.*, Ideas-Tradition.*, Magazine.*, Monologues.*, Pop-Cultures.*, Research.*
// Path gambar: /public/assets/** → pakai "/assets/**" di sini.

export type ArticleSection =
  | "ideas-tradition"
  | "magazine"
  | "monologues"
  | "pop-cultures"
  | "reading-guides"
  | "research";

export type ArticleAuthor = { name: string; avatar?: string };

export type ArticleMeta = {
  id: string;
  slug: string;
  title: string;
  section: ArticleSection;
  category?: string;
  excerpt: string;
  author: ArticleAuthor;
  publishedAt: string;
  readingTime: number;
  cover: string;
  image?: string;
  tags: string[];
  isFeatured?: boolean;
  highlightQuote?: string;
};

export const articles: ArticleMeta[] = [
  /* =========================
   * IDEAS & TRADITION
   * ========================= */
  {
    id: "it-1",
    slug: "ideas-1",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas.jpeg",
    image: "/assets/ideas&tradition/ideas.jpeg",
    tags: ["ideas"]
  },
  {
    id: "it-2",
    slug: "ideas-2",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas1.jpeg",
    image: "/assets/ideas&tradition/ideas1.jpeg",
    tags: ["ideas"]
  },
  {
    id: "it-3",
    slug: "ideas-3",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas2.jpeg",
    image: "/assets/ideas&tradition/ideas2.jpeg",
    tags: ["ideas"]
  },
  {
    id: "it-4",
    slug: "ideas-4",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas.jpeg",
    image: "/assets/ideas&tradition/ideas.jpeg",
    tags: ["ideas"]
  },
  {
    id: "it-5",
    slug: "ideas-5",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas1.jpeg",
    image: "/assets/ideas&tradition/ideas1.jpeg",
    tags: ["ideas"]
  },
  {
    id: "it-6",
    slug: "ideas-6",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas2.jpeg",
    image: "/assets/ideas&tradition/ideas2.jpeg",
    tags: ["ideas"]
  },
  {
    id: "it-7",
    slug: "ideas-7",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas.jpeg",
    image: "/assets/ideas&tradition/ideas.jpeg",
    tags: ["ideas"]
  },
  {
    id: "it-8",
    slug: "ideas-8",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas1.jpeg",
    image: "/assets/ideas&tradition/ideas1.jpeg",
    tags: ["ideas"]
  },
  {
    id: "it-9",
    slug: "ideas-9",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas2.jpeg",
    image: "/assets/ideas&tradition/ideas2.jpeg",
    tags: ["ideas"]
  },
  {
    id: "it-10",
    slug: "ideas-10",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas.jpeg",
    image: "/assets/ideas&tradition/ideas.jpeg",
    tags: ["ideas"]
  },

  {
    id: "it-12",
    slug: "ideas-12",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas1.jpeg",
    image: "/assets/ideas&tradition/ideas1.jpeg",
    tags: ["ideas"]
  },
  {
    id: "it-13",
    slug: "ideas-13",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas2.jpeg",
    image: "/assets/ideas&tradition/ideas2.jpeg",
    tags: ["ideas"]
  },
  {
    id: "it-14",
    slug: "ideas-14",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas.jpeg",
    image: "/assets/ideas&tradition/ideas.jpeg",
    tags: ["ideas"]
  },
  {
    id: "it-15",
    slug: "ideas-15",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas1.jpeg",
    image: "/assets/ideas&tradition/ideas1.jpeg",
    tags: ["ideas"]
  },
  {
    id: "it-16",
    slug: "ideas-16",
    title: "Lorem Ipsum Dolor Sit",
    section: "ideas-tradition",
    category: "Essays",
    excerpt: "",
    author: { name: "Author Ideas" },
    publishedAt: "2025-05-22",
    readingTime: 0,
    cover: "/assets/ideas&tradition/ideas2.jpeg",
    image: "/assets/ideas&tradition/ideas2.jpeg",
    tags: ["ideas"]
  },

  {
    id: "a-it-h001",
    slug: "ideas-highlight-001",
    title: "LOREM IPSUM DOLOR SIT",
    section: "ideas-tradition",
    category: "Highlight",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/research/Research (2).png",
    image: "/assets/research/Research (2).png",
    tags: ["ideas", "highlight"]
  },
  {
    id: "a-it-h002",
    slug: "ideas-highlight-002",
    title: "CONSECTETUR ADIPISCING",
    section: "ideas-tradition",
    category: "Highlight",
    excerpt:
      "Sed ut perspiciatis unde omnis iste natus error sit...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/research/Husk.jpg",
    image: "/assets/research/Husk.jpg",
    tags: ["ideas", "highlight"]
  },
  {
    id: "a-it-h003",
    slug: "ideas-highlight-003",
    title: "EIUSMOD TEMPOR INCIDIDUNT",
    section: "ideas-tradition",
    category: "Highlight",
    excerpt:
      "Ut enim ad minima veniam, quis nostrum exercitationem...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/research/Husk.jpg",
    image: "/assets/research/Husk.jpg",
    tags: ["ideas", "highlight"]
  },
  {
    id: "a-it-h004",
    slug: "ideas-highlight-004",
    title: "LABORE ET DOLORE MAGNA",
    section: "ideas-tradition",
    category: "Highlight",
    excerpt:
      "At vero eos et accusamus et iusto odio dignissimos...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/article4.jpg",
    image: "/assets/article4.jpg",
    tags: ["ideas", "highlight"]
  },
  {
    id: "a-it-h005",
    slug: "ideas-highlight-005",
    title: "ALIQUA UT ENIM AD MINIM",
    section: "ideas-tradition",
    category: "Highlight",
    excerpt:
      "Nam libero tempore, cum soluta nobis est eligendi...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/article5.jpg",
    image: "/assets/article5.jpg",
    tags: ["ideas", "highlight"]
  },

  /* =========================
   * MAGAZINE
   * ========================= */
  {
    id: "a-mag-101",
    slug: "mag-collection-101",
    title: "LOREM IPSUM DOLOR SIT",
    section: "magazine",
    category: "Collection",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: { name: "Lorem" },
    publishedAt: "2025-07-10",
    readingTime: 6,
    cover: "/assets/download (28).jpeg",
    image: "/assets/download (28).jpeg",
    tags: ["magazine", "collection"]
  },
  {
    id: "a-mag-102",
    slug: "mag-collection-102",
    title: "LOREM IPSUM DOLOR SIT",
    section: "magazine",
    category: "Collection",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: { name: "Lorem" },
    publishedAt: "2025-07-11",
    readingTime: 6,
    cover: "/assets/magazine/Rectangle 4528.png",
    image: "/assets/magazine/Rectangle 4528.png",
    tags: ["magazine", "collection"]
  },
  {
    id: "a-mag-103",
    slug: "mag-collection-103",
    title: "LOREM IPSUM DOLOR SIT",
    section: "magazine",
    category: "Collection",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: { name: "Lorem" },
    publishedAt: "2025-07-12",
    readingTime: 6,
    cover: "/assets/download (28).jpeg",
    image: "/assets/download (28).jpeg",
    tags: ["magazine", "collection"]
  },
  {
    id: "a-mag-104",
    slug: "mag-collection-104",
    title: "LOREM IPSUM DOLOR SIT",
    section: "magazine",
    category: "Collection",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: { name: "Lorem" },
    publishedAt: "2025-07-13",
    readingTime: 6,
    cover: "/assets/magazine/Rectangle 4528.png",
    image: "/assets/magazine/Rectangle 4528.png",
    tags: ["magazine", "collection"]
  },
  {
    id: "a-mag-105",
    slug: "mag-collection-105",
    title: "LOREM IPSUM DOLOR SIT",
    section: "magazine",
    category: "Collection",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: { name: "Lorem" },
    publishedAt: "2025-07-14",
    readingTime: 6,
    cover: "/assets/download (28).jpeg",
    image: "/assets/download (28).jpeg",
    tags: ["magazine", "collection"]
  },

  {
    id: "a-mag-001",
    slug: "issue-01-letters",
    title: "Magazine Issue #01 — Letters from the Field",
    section: "magazine",
    category: "Magazine",
    excerpt:
      "Kumpulan catatan lapangan tentang ide-ide yang bergerak dari ruang baca ke ruang hidup.",
    author: { name: "Magazine Editors" },
    publishedAt: "2025-07-30",
    readingTime: 9,
    cover: "/assets/popCulture/mag-issue-01.jpg",
    image: "/assets/popCulture/mag-issue-01.jpg",
    tags: ["magazine", "editorial"],
    isFeatured: true
  },
  {
    id: "a-mag-002",
    slug: "issue-01-interview",
    title: "Conversations: On Learning in Public",
    section: "magazine",
    category: "Interview",
    excerpt: "Wawancara tentang praktik belajar di ruang publik digital.",
    author: { name: "Nadia I." },
    publishedAt: "2025-07-31",
    readingTime: 6,
    cover: "/assets/popCulture/interview-learning.jpg",
    image: "/assets/popCulture/interview-learning.jpg",
    tags: ["interview", "learning"]
  },

  /* =========================
   * MONOLOGUES
   * ========================= */
  {
    id: "a-mlg-h001",
    slug: "monologues-highlight-001",
    title: "LOREM IPSUM DOLOR SIT",
    section: "monologues",
    category: "Highlight",
    excerpt: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/research/Research (2).png",
    image: "/assets/research/Research (2).png",
    tags: ["monologues", "highlight"]
  },
  {
    id: "a-mlg-h002",
    slug: "monologues-highlight-002",
    title: "CONSECTETUR ADIPISCING",
    section: "monologues",
    category: "Highlight",
    excerpt: "Sed ut perspiciatis unde omnis iste natus error sit...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/research/Husk.jpg",
    image: "/assets/research/Husk.jpg",
    tags: ["monologues", "highlight"]
  },
  {
    id: "a-mlg-h003",
    slug: "monologues-highlight-003",
    title: "EIUSMOD TEMPOR INCIDIDUNT",
    section: "monologues",
    category: "Highlight",
    excerpt: "Ut enim ad minima veniam, quis nostrum exercitationem...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/research/Husk.jpg",
    image: "/assets/research/Husk.jpg",
    tags: ["monologues", "highlight"]
  },
  {
    id: "a-mlg-h004",
    slug: "monologues-highlight-004",
    title: "LABORE ET DOLORE MAGNA",
    section: "monologues",
    category: "Highlight",
    excerpt: "At vero eos et accusamus et iusto odio dignissimos...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/article4.jpg",
    image: "/assets/article4.jpg",
    tags: ["monologues", "highlight"]
  },
  {
    id: "a-mlg-h005",
    slug: "monologues-highlight-005",
    title: "ALIQUA UT ENIM AD MINIM",
    section: "monologues",
    category: "Highlight",
    excerpt: "Nam libero tempore, cum soluta nobis est eligendi...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/article5.jpg",
    image: "/assets/article5.jpg",
    tags: ["monologues", "highlight"]
  },

  {
    id: "201",
    slug: "monologues-201",
    title: "Lorem Ipsum Dolor Sit",
    section: "monologues",
    category: "Monologues",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin rutrum magna neque, ut lacinia elit ullamcorper eget. Ut lobortis ultrices lorem, id convallis urna porta eu...",
    author: { name: "Jane Doe" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/monologues/women.jpg",
    image: "/assets/monologues/women.jpg",
    tags: ["monologues"]
  },
  {
    id: "202",
    slug: "monologues-202",
    title: "Lorem Ipsum Dolor Sit",
    section: "monologues",
    category: "Monologues",
    excerpt:
      "Ini adalah konten untuk artikel kedua dari monologues. Anda bisa mengisinya dengan teks yang lebih panjang di sini.",
    author: { name: "Author Monologue" },
    publishedAt: "2025-05-22",
    readingTime: 3,
    cover: "/assets/monologues/kratzhll.jpg",
    image: "/assets/monologues/kratzhll.jpg",
    tags: ["monologues"]
  },
  {
    id: "203",
    slug: "monologues-203",
    title: "Lorem Ipsum Dolor Sit",
    section: "monologues",
    category: "Monologues",
    excerpt:
      "Ini adalah konten untuk artikel kedua dari monologues. Anda bisa mengisinya dengan teks yang lebih panjang di sini.",
    author: { name: "Author Monologue" },
    publishedAt: "2025-05-22",
    readingTime: 3,
    cover: "/assets/monologues/kratzhll.jpg",
    image: "/assets/monologues/kratzhll.jpg",
    tags: ["monologues"]
  },
  {
    id: "204",
    slug: "monologues-204",
    title: "Lorem Ipsum Dolor Sit",
    section: "monologues",
    category: "Monologues",
    excerpt:
      "Ini adalah konten untuk artikel kedua dari monologues. Anda bisa mengisinya dengan teks yang lebih panjang di sini.",
    author: { name: "Author Monologue" },
    publishedAt: "2025-05-22",
    readingTime: 3,
    cover: "/assets/monologues/kratzhll.jpg",
    image: "/assets/monologues/kratzhll.jpg",
    tags: ["monologues"]
  },
  {
    id: "205",
    slug: "monologues-205",
    title: "Lorem Ipsum Dolor Sit",
    section: "monologues",
    category: "Monologues",
    excerpt:
      "Ini adalah konten untuk artikel kedua dari monologues. Anda bisa mengisinya dengan teks yang lebih panjang di sini.",
    author: { name: "Author Monologue" },
    publishedAt: "2025-05-22",
    readingTime: 3,
    cover: "/assets/monologues/kratzhll.jpg",
    image: "/assets/monologues/kratzhll.jpg",
    tags: ["monologues"]
  },
  {
    id: "206",
    slug: "monologues-206",
    title: "Lorem Ipsum Dolor Sit",
    section: "monologues",
    category: "Monologues",
    excerpt:
      "Ini adalah konten untuk artikel kedua dari monologues. Anda bisa mengisinya dengan teks yang lebih panjang di sini.",
    author: { name: "Author Monologue" },
    publishedAt: "2025-05-22",
    readingTime: 3,
    cover: "/assets/monologues/kratzhll.jpg",
    image: "/assets/monologues/kratzhll.jpg",
    tags: ["monologues"]
  },

  {
    id: "a-mlg-001",
    slug: "a-room-of-ones-mind",
    title: "A Room of One's Mind",
    section: "monologues",
    category: "Monologue",
    excerpt:
      "Refleksi personal tentang ruang batin, rutinitas kreatif, dan keheningan sebagai metode.",
    author: { name: "M. Affandi" },
    publishedAt: "2025-08-05",
    readingTime: 4,
    cover: "/assets/popCulture/monologue-room.jpg",
    image: "/assets/popCulture/monologue-room.jpg",
    tags: ["monologue", "craft"]
  },
  {
    id: "a-mlg-002",
    slug: "why-we-annotate",
    title: "Why We Annotate",
    section: "monologues",
    category: "Practice",
    excerpt: "Alasan praktis di balik kebiasaan anotasi teks panjang.",
    author: { name: "Addys" },
    publishedAt: "2025-08-10",
    readingTime: 3,
    cover: "/assets/popCulture/annotate.jpg",
    image: "/assets/popCulture/annotate.jpg",
    tags: ["method", "reading"]
  },

  /* =========================
   * POP CULTURES
   * ========================= */
  {
    id: "a-pop-h001",
    slug: "pop-culture-highlight-001",
    title: "LOREM IPSUM DOLOR SIT",
    section: "pop-cultures",
    category: "Highlight",
    excerpt: "Lorem ipsum dolor sit amet...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-18",
    readingTime: 4,
    cover: "/assets/popCulture/1.jpg",
    image: "/assets/popCulture/1.jpg",
    tags: ["pop-cultures", "highlight"]
  },
  {
    id: "a-pop-h002",
    slug: "pop-culture-highlight-002",
    title: "CONSECTETUR ADIPISCING",
    section: "pop-cultures",
    category: "Highlight",
    excerpt: "Sed ut perspiciatis unde omnis...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-18",
    readingTime: 4,
    cover: "/assets/popCulture/2.jpg",
    image: "/assets/popCulture/2.jpg",
    tags: ["pop-cultures", "highlight"]
  },
  {
    id: "a-pop-h003",
    slug: "pop-culture-highlight-003",
    title: "EIUSMOD TEMPOR INCIDIDUNT",
    section: "pop-cultures",
    category: "Highlight",
    excerpt: "Ut enim ad minima veniam...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-18",
    readingTime: 4,
    cover: "/assets/popCulture/3.jpg",
    image: "/assets/popCulture/3.jpg",
    tags: ["pop-cultures", "highlight"]
  },
  {
    id: "a-pop-h004",
    slug: "pop-culture-highlight-004",
    title: "LABORE ET DOLORE MAGNA",
    section: "pop-cultures",
    category: "Highlight",
    excerpt: "At vero eos et accusamus et iusto...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-18",
    readingTime: 4,
    cover: "/assets/popCulture/4.jpg",
    image: "/assets/popCulture/4.jpg",
    tags: ["pop-cultures", "highlight"]
  },
  {
    id: "a-pop-h005",
    slug: "pop-culture-highlight-005",
    title: "ALIQUA UT ENIM AD MINIM",
    section: "pop-cultures",
    category: "Highlight",
    excerpt: "Nam libero tempore, cum soluta...",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-18",
    readingTime: 4,
    cover: "/assets/popCulture/5.jpg",
    image: "/assets/popCulture/5.jpg",
    tags: ["pop-cultures", "highlight"]
  },

  {
    id: "a-pop-r001",
    slug: "pop-review-001",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Author Pop-Culture" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop.jpeg",
    image: "/assets/popCulture/pop.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r002",
    slug: "pop-review-002",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop1.jpeg",
    image: "/assets/popCulture/pop1.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r003",
    slug: "pop-review-003",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop2.jpeg",
    image: "/assets/popCulture/pop2.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r004",
    slug: "pop-review-004",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop.jpeg",
    image: "/assets/popCulture/pop.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r005",
    slug: "pop-review-005",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop1.jpeg",
    image: "/assets/popCulture/pop1.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r006",
    slug: "pop-review-006",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop2.jpeg",
    image: "/assets/popCulture/pop2.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r007",
    slug: "pop-review-007",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop.jpeg",
    image: "/assets/popCulture/pop.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r008",
    slug: "pop-review-008",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop1.jpeg",
    image: "/assets/popCulture/pop1.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r009",
    slug: "pop-review-009",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop2.jpeg",
    image: "/assets/popCulture/pop2.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r010",
    slug: "pop-review-010",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop.jpeg",
    image: "/assets/popCulture/pop.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r011",
    slug: "pop-review-011",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop1.jpeg",
    image: "/assets/popCulture/pop1.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r012",
    slug: "pop-review-012",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop2.jpeg",
    image: "/assets/popCulture/pop2.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r013",
    slug: "pop-review-013",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop.jpeg",
    image: "/assets/popCulture/pop.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r014",
    slug: "pop-review-014",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop1.jpeg",
    image: "/assets/popCulture/pop1.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r015",
    slug: "pop-review-015",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop2.jpeg",
    image: "/assets/popCulture/pop2.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r016",
    slug: "pop-review-016",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop.jpeg",
    image: "/assets/popCulture/pop.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r017",
    slug: "pop-review-017",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop1.jpeg",
    image: "/assets/popCulture/pop1.jpeg",
    tags: ["pop-cultures", "review"]
  },
  {
    id: "a-pop-r018",
    slug: "pop-review-018",
    title: "Lorem Ipsum Dolor Sit",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Dummy excerpt for pop review grid.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-05-22",
    readingTime: 4,
    cover: "/assets/popCulture/pop2.jpeg",
    image: "/assets/popCulture/pop2.jpeg",
    tags: ["pop-cultures", "review"]
  },

  {
    id: "a-pop-001",
    slug: "myths-in-modern-cinema",
    title: "Myths in Modern Cinema",
    section: "pop-cultures",
    category: "Review",
    excerpt:
      "Membaca film populer dengan kacamata mitos—struktur naratif yang tak lekang waktu.",
    author: { name: "Bunga" },
    publishedAt: "2025-08-02",
    readingTime: 6,
    cover: "/assets/popCulture/cinema-myths.jpg",
    image: "/assets/popCulture/cinema-myths.jpg",
    tags: ["film", "myth", "review"],
    isFeatured: true
  },
  {
    id: "a-pop-002",
    slug: "games-that-teach",
    title: "Games That Teach",
    section: "pop-cultures",
    category: "Review",
    excerpt: "Gim yang diam-diam membangun kebiasaan berpikir.",
    author: { name: "Editorial Team" },
    publishedAt: "2025-08-08",
    readingTime: 5,
    cover: "/assets/popCulture/games-learn.jpg",
    image: "/assets/popCulture/games-learn.jpg",
    tags: ["games", "learning"]
  },

  /* =========================
   * READING GUIDES
   * ========================= */
  {
    id: "a-rg-001",
    slug: "how-to-start-a-reading-group",
    title: "How to Start a Reading Group",
    section: "reading-guides",
    category: "Guide",
    excerpt:
      "Panduan ringkas membangun kelompok baca: tujuan, ritme, hingga etika diskusi.",
    author: { name: "Community" },
    publishedAt: "2025-07-25",
    readingTime: 5,
    cover: "/assets/popCulture/reading-group.jpg",
    image: "/assets/popCulture/reading-group.jpg",
    tags: ["guide", "community"]
  },

  /* =========================
  * RESEARCH
  * ========================= */
  {
    id: "a-rsc-001",
    slug: "field-notes-on-method",
    title: "LOREM IPSUM DOLOR SIT",
    section: "research",
    category: "Methods",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: { name: "Research Unit" },
    publishedAt: "2025-08-15",
    readingTime: 8,
    cover: "/assets/research/Husk.jpg",
    image: "/assets/research/Husk.jpg",
    tags: ["research", "method"]
  },
  {
    id: "a-rsc-101",
    slug: "research-101",
    title: "LOREM IPSUM DOLOR SIT",
    section: "research",
    category: "Notes",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    author: { name: "Author Name" },
    publishedAt: "2025-05-22",
    readingTime: 6,
    cover: "/assets/research/Research (2).png",
    image: "/assets/research/Research (2).png",
    tags: ["research"]
  },
  {
    id: "a-rsc-102",
    slug: "research-102",
    title: "Lorem Ipsum Dolor Sit",
    section: "research",
    category: "Notes",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    author: { name: "Research Unit" },
    publishedAt: "2025-05-05",
    readingTime: 6,
    cover: "/assets/research/Husk.jpg",
    image: "/assets/research/Husk.jpg",
    tags: ["research"]
  },
  {
    id: "a-rsc-103",
    slug: "research-103",
    title: "Lorem Ipsum Dolor Sit",
    section: "research",
    category: "Notes",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...",
    author: { name: "Research Unit" },
    publishedAt: "2025-05-05",
    readingTime: 6,
    cover: "/assets/research/Research (2).png",
    image: "/assets/research/Research (2).png",
    tags: ["research"]
  },
  {
    id: "a-rsc-104",
    slug: "artikel-keempat",
    title: "Artikel Keempat",
    section: "research",
    category: "Notes",
    excerpt: "Ini adalah artikel keempat yang awalnya sebagian tersembunyi.",
    author: { name: "Research Unit" },
    publishedAt: "2025-05-05",
    readingTime: 5,
    cover: "/assets/research/Husk.jpg",
    image: "/assets/research/Husk.jpg",
    tags: ["research"]
  },
  {
    id: "a-rsc-105",
    slug: "artikel-kelima",
    title: "Artikel Kelima",
    section: "research",
    category: "Notes",
    excerpt: "Ini adalah artikel kelima yang akan muncul setelah load more.",
    author: { name: "Research Unit" },
    publishedAt: "2025-05-05",
    readingTime: 5,
    cover: "/assets/research/Research (2).png",
    image: "/assets/research/Research (2).png",
    tags: ["research"]
  },

  {
    id: "a-rsc-h001",
    slug: "research-highlight-001",
    title: "LOREM IPSUM DOLOR SIT",
    section: "research",
    category: "Highlight",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna",
    author: { name: "Research Unit" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/research/Research (2).png",
    image: "/assets/research/Research (2).png",
    tags: ["research", "highlight"]
  },
  {
    id: "a-rsc-h002",
    slug: "research-highlight-002",
    title: "CONSECTETUR ADIPISCING",
    section: "research",
    category: "Highlight",
    excerpt:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam",
    author: { name: "Research Unit" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/research/Husk.jpg",
    image: "/assets/research/Husk.jpg",
    tags: ["research", "highlight"]
  },
  {
    id: "a-rsc-h003",
    slug: "research-highlight-003",
    title: "EIUSMOD TEMPOR INCIDIDUNT",
    section: "research",
    category: "Highlight",
    excerpt:
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut aliquid ex ea",
    author: { name: "Research Unit" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/research/Husk.jpg",
    image: "/assets/research/Husk.jpg",
    tags: ["research", "highlight"]
  },
  {
    id: "a-rsc-h004",
    slug: "research-highlight-004",
    title: "LABORE ET DOLORE MAGNA",
    section: "research",
    category: "Highlight",
    excerpt:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque",
    author: { name: "Research Unit" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/article4.jpg",
    image: "/assets/article4.jpg",
    tags: ["research", "highlight"]
  },
  {
    id: "a-rsc-h005",
    slug: "research-highlight-005",
    title: "ALIQUA UT ENIM AD MINIM",
    section: "research",
    category: "Highlight",
    excerpt:
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat",
    author: { name: "Research Unit" },
    publishedAt: "2025-05-20",
    readingTime: 4,
    cover: "/assets/article5.jpg",
    image: "/assets/article5.jpg",
    tags: ["research", "highlight"]
  },
];

export const allArticles = articles;
export default articles;