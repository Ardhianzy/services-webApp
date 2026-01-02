// File: src/routes/MegazineRoutes.ts

import { Router } from "express";
import { MegazineHandler } from "../feature/Megazine/handler/MegazineHandler"; // Pastikan path ini benar
import { authenticate } from "../middleware/authenticate";
import { uploadMixedLocal } from "../middleware/multerPdf";

import { validate } from "../middleware/validate";
import { createMegazineSchema, updateMegazineSchema } from "../feature/Megazine/validation";
import { uploadLimiter } from "../middleware/rateLimiter";

const router = Router();
const megazineHandler = new MegazineHandler();

const handleFiles = uploadMixedLocal.fields([
  { name: "image", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]);

router.post(
  "/",
  authenticate,
  uploadLimiter,
  handleFiles,
  validate(createMegazineSchema),
  megazineHandler.createByAdmin.bind(megazineHandler)
);
router.put(
  "/:id",
  authenticate,
  uploadLimiter,
  handleFiles, // Middleware untuk file
  validate(updateMegazineSchema),
  megazineHandler.updateById.bind(megazineHandler)
);

router.delete(
  "/:id",
  authenticate,
  megazineHandler.deleteById.bind(megazineHandler)
);

router.get("/", megazineHandler.getAll.bind(megazineHandler));

// Mendapatkan satu Megazine berdasarkan slug-nya (lebih baik untuk SEO)
router.get("/:slug", megazineHandler.findBySlug.bind(megazineHandler));

export default router;
