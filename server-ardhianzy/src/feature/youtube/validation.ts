import { z } from "zod";

export const createYoutubeSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title required"),
    url: z.string().url("Must be a valid URL"),
    description: z.string().min(1, "Description required"),
  }),
});

export const updateYoutubeSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID is required"),
  }),
  body: z.object({
    title: z.string().optional(),
    url: z.string().url().optional(),
    description: z.string().optional(),
  }),
});
