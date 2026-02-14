import { z } from "zod";

const booleanString = z.union([
  z.boolean(),
  z.string().transform((val) => val === "true"),
]).optional();

export const createResearchSchema = z.object({
  body: z.object({
    research_title: z.string().min(1, "Title required"),
    research_sum: z.string().min(1, "Summary required"),
    researcher: z.string().min(1, "Researcher required"),
    research_date: z.string().optional(), // Coerce in handler usually
    fiel: z.string().min(1, "Field required"),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    keywords: z.string().optional(),
    is_published: booleanString,
  }),
});

export const updateResearchSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID is required"),
  }),
  body: z.object({
    research_title: z.string().optional(),
    research_sum: z.string().optional(),
    researcher: z.string().optional(),
    research_date: z.string().optional(),
    fiel: z.string().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    keywords: z.string().optional(),
    is_published: booleanString,
    remove_pdf: booleanString,
  }),
});
