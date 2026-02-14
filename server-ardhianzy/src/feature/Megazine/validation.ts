import { z } from "zod";

const booleanString = z.union([
  z.boolean(),
  z.string().transform((val) => val === "true"),
]).optional();

export const createMegazineSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title required"),
    description: z.string().min(10, "Description required"),
    megazine_isi: z.string().min(10, "Content required"),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    keywords: z.string().optional(),
  }),
  // Multer handles files, we mainly validate body here. 
  // Handler checks file presence manually or we can check req.files if we used a more complex validator.
});

export const updateMegazineSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID is required"),
  }),
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    megazine_isi: z.string().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    keywords: z.string().optional(),
    remove_pdf: booleanString,
  }),
});
