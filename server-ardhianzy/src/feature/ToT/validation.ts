import { z } from "zod";

// Helper to coerce boolean from string "true"/"false" or boolean
const booleanString = z.union([
  z.boolean(),
  z.string().transform((val) => val === "true"),
]).optional();

export const createToTSchema = z.object({
  body: z.object({
    philosofer: z.string().min(1, "Philosofer name is required"),
    geoorigin: z.string().min(1, "Geoorigin is required"),
    detail_location: z.string().min(1, "Detail location is required"),
    years: z.string().min(1, "Years is required"),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    keywords: z.string().optional(),
    is_published: booleanString,
    modern_country: z.string().optional(),
  }),
  // File is optional in service, so optional here too.
  // If you want to enforce file types, you can add more checks, but Multer fileFilter already handles mimetype.
  file: z.any().optional(), 
});

export const updateToTSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID is required"),
  }),
  body: z.object({
    philosofer: z.string().optional(),
    geoorigin: z.string().optional(),
    detail_location: z.string().optional(),
    years: z.string().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    keywords: z.string().optional(),
    is_published: booleanString,
    modern_country: z.string().optional(),
  }),
  file: z.any().optional(),
});
