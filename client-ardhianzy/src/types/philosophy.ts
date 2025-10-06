// src/types/philosophy.ts
export type BookRef = { cover: string; title?: string };

export type Philosopher = {
  id: string | number;
  name: string;
  years?: string;
  born?: number;
  died?: number;
  country?: string;
  coordinates?: [number, number];
  image?: string;
  flag?: string;

  // detail biografi (dipakai komponen biography)
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  deathPlace?: string;
  description?: string;
  descript?: string;
  desc?: string;
  books?: BookRef[];
};