import { z } from "zod";

const booleanString = z.union([
  z.boolean(),
  z.string().transform((val) => val === "true"),
]).optional();

export const createToTMetaSchema = z.object({
  body: z.object({
    ToT_id: z.string().min(1, "ToT ID required"),
    metafisika: z.string().min(1, "Metafisika required"),
    epsimologi: z.string().min(1, "Epsimologi required"),
    aksiologi: z.string().min(1, "Aksiologi required"),
    conclusion: z.string().min(1, "Conclusion required"),
    is_published: booleanString,
  }),
});

export const updateToTMetaSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID is required"),
  }),
  body: z.object({
    ToT_id: z.string().optional(),
    metafisika: z.string().optional(),
    epsimologi: z.string().optional(),
    aksiologi: z.string().optional(),
    conclusion: z.string().optional(),
    is_published: booleanString,
  }),
});
