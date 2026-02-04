import { z } from "zod";


// Helper to coerce boolean
const booleanString = z.union([
  z.boolean(),
  z.string().transform((val) => val === "true"),
]).optional();

export const createArticleSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    author: z.string().min(3, "Author is required"),
    date: z.string().optional(), // Or z.coerce.date()

    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    keywords: z.string().optional(),
    excerpt: z.string().optional(),
    canonical_url: z.string().optional(),
    is_published: booleanString,
    is_featured: booleanString,
    view_count: z.string().optional(), // Often sent as string in multipart
  }),
  file: z.any().optional(), // Image is handled by code logic, but required in creation
});

export const updateArticleSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID is required"),
  }),
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    author: z.string().optional(),
    date: z.string().optional(),

    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    keywords: z.string().optional(),
    excerpt: z.string().optional(),
    canonical_url: z.string().optional(),
    is_published: booleanString,
    is_featured: booleanString,
    view_count: z.string().optional(),
  }),
  file: z.any().optional(),
});
