import { z } from "zod";

const booleanString = z.union([
  z.boolean(),
  z.string().transform((val) => val === "true"),
]).optional();

export const createShopSchema = z.object({
  body: z.object({
    stock: z.string().min(1, "Stock required"),
    title: z.string().min(1, "Title required"),
    category: z.string().min(1, "Category required"),
    price: z.string().min(1, "Price required"),
    link: z.string().min(1, "Link required"),
    desc: z.string().min(1, "Description required"),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    is_available: booleanString,
  }),
});

export const updateShopSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID is required"),
  }),
  body: z.object({
    stock: z.string().optional(),
    title: z.string().optional(),
    category: z.string().optional(),
    price: z.string().optional(),
    link: z.string().optional(),
    desc: z.string().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    is_available: booleanString,
  }),
});
