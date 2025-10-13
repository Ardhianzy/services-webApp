export type ShopItem = {
  id?: string | number;
  title: string;
  description?: string;
  image?: string;
  price?: number;
  category?: string;
  condition?: string;
  author?: string;
  buyer?: string | null;
  is_available?: boolean;
  message?: string;
  // timestamps? bebas kalau BE kirim
};