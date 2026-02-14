import { z } from "zod";

const booleanString = z.union([
  z.boolean(),
  z.string().transform((val) => val === "true"),
]).optional();

export const createMonologueSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title required"),
    dialog: z.string().min(1, "Dialog required"),
    judul: z.string().min(1, "Judul required"),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    is_published: booleanString,
  }),
});

export const updateMonologueSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID is required"),
  }),
  body: z.object({
    title: z.string().optional(),
    dialog: z.string().optional(),
    judul: z.string().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    is_published: booleanString,
    remove_pdf: booleanString,
  }),
});
