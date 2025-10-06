// src/types/shop.ts
export type ReviewInfo = {
  rating: number;
  count: number;
};

export type Product = {
  id: string | number;
  title: string;
  price: string;
  category: string;
  theme: string;
  imageUrl: string;
  galleryImages?: string[];
  description?: string;
  reviews?: ReviewInfo;
};