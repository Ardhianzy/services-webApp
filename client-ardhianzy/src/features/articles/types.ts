// src/features/articles/types.ts
export type Article = {
  id?: string | number;
  title: string;
  slug: string;

  section?: string | null;
  category?: string | null;

  excerpt?: string | null;
  content?: string | null;
  highlightQuote?: string | null;

  author?: string | null;        // atau { name: string; avatar?: string } di sisi FE hybrid
  isFeatured?: boolean | null;

  image?: string | null;         
  cover?: string | null;         
  thumbnail?: string | null;     

  publishedAt?: string | null;
};