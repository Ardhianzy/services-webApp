// src/types/books.ts
export type Author = {
  id: string | number;
  name: string;
};

export type Book = {
  id: string | number;
  authorId: string | number;
  title: string;
  coverImg: string;
  description?: string;
};

export type ReadingGuideStep = {
  bookId: string | number;
  note?: string;
};

export type ReadingGuide = {
  id: string | number;
  title: string;
  targetBookId: string | number;
  authorId: string | number;
  excerpt: string;
  steps: ReadingGuideStep[];
};