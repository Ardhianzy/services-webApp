// src/data/products.ts
import type { Product } from "../types/shop";

export const products: Product[] = [
  {
    id: 1,
    title: "VINTAGE CAMERA",
    category: "Merchandise",
    theme: "Hobby",
    price: "Rp 3.500.000",
    description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    reviews: { rating: 5.0, count: 100 },
    imageUrl: "/assets/product-images/camera-main.png",
    galleryImages: [
      "/assets/product-images/camera-main.png",
      "/assets/product-images/camera-side.png",
      "/assets/product-images/camera-back.png",
      "/assets/product-images/camera-lens.png",
    ],
  },
  {
    id: 2,
    title: "LEATHER WATCH",
    category: "Merchandise",
    theme: "Fashion",
    price: "Rp 1.750.000",
    description:
      "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.",
    reviews: { rating: 4.8, count: 87 },
    imageUrl: "/assets/product-images/watch-main.png",
    galleryImages: [
      "/assets/product-images/watch-main.png",
      "/assets/product-images/watch-side.png",
      "/assets/product-images/watch-strap.png",
    ],
  },
  {
    id: 3,
    title: "RETRO HEADPHONES",
    category: "Merchandise",
    theme: "Music",
    price: "Rp 950.000",
    description:
      "In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi.",
    reviews: { rating: 4.9, count: 152 },
    imageUrl: "/assets/product-images/headphones-main.png",
    galleryImages: [
      "/assets/product-images/headphones-main.png",
      "/assets/product-images/headphones-side.png",
      "/assets/product-images/headphones-folded.png",
    ],
  },
  {
    id: 4,
    title: "CLASSIC BACKPACK",
    category: "Merchandise",
    theme: "Travel",
    price: "Rp 1.200.000",
    description:
      "Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.",
    reviews: { rating: 4.7, count: 110 },
    imageUrl: "/assets/product-images/backpack-main.png",
    galleryImages: [
      "/assets/product-images/backpack-main.png",
      "/assets/product-images/backpack-side.png",
      "/assets/product-images/backpack-open.png",
    ],
  },
  {
    id: 5,
    title: "LEARN REACT",
    category: "Book",
    theme: "Programming",
    price: "Rp 250.000",
    description: "Buku fundamental untuk mempelajari React dari dasar hingga mahir.",
    reviews: { rating: 4.9, count: 230 },
    imageUrl: "/assets/product-images/book-react.png",
    galleryImages: [
      "/assets/product-images/book-react.png",
      "/assets/product-images/book-react-side.png",
    ],
  },
  {
    id: 6,
    title: "LEARN REACT",
    category: "Book",
    theme: "Programming",
    price: "Rp 250.000",
    description: "Buku fundamental untuk mempelajari React dari dasar hingga mahir.",
    reviews: { rating: 4.9, count: 230 },
    imageUrl: "/assets/product-images/book-react.png",
    galleryImages: [
      "/assets/product-images/book-react.png",
      "/assets/product-images/book-react-side.png",
    ],
  },
  {
    id: 7,
    title: "LEARN REACT",
    category: "Book",
    theme: "Programming",
    price: "Rp 250.000",
    description: "Buku fundamental untuk mempelajari React dari dasar hingga mahir.",
    reviews: { rating: 4.9, count: 230 },
    imageUrl: "/assets/product-images/book-react.png",
    galleryImages: [
      "/assets/product-images/book-react.png",
      "/assets/product-images/book-react-side.png",
    ],
  },
];

export default products;