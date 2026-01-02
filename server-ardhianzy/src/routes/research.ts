// src/routes/research.ts
import { Router } from "express";
import { ResearchHandler } from "../feature/research/handler/crud_res";
import { authenticate } from "../middleware/authenticate";
import { uploadMixedLocal } from "../middleware/multerPdf";
import { validate } from "../middleware/validate";
import { createResearchSchema, updateResearchSchema } from "../feature/research/validation";
import { uploadLimiter } from "../middleware/rateLimiter";

const router = Router();
const researchHandler = new ResearchHandler();

router.post(
  "/",
  authenticate,
  uploadLimiter,
  uploadMixedLocal.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  validate(createResearchSchema),
  researchHandler.createByAdmin
);

router.put(
  "/:id",
  authenticate,
  uploadLimiter,
  uploadMixedLocal.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  validate(updateResearchSchema),
  researchHandler.updateById
);
router.get("/", researchHandler.getAll);
router.get("/title/:researchTitle", researchHandler.getByResearchTitle);

router.delete("/:id", authenticate, researchHandler.deleteById);

export default router;
