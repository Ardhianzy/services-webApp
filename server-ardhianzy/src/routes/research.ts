// src/routes/research.ts
import { Router } from "express";
import { ResearchHandler } from "../feature/research/handler/crud_res";
import { authenticate } from "../middleware/authenticate";
import { uploadMixedLocal } from "../middleware/multerPdf";
const router = Router();
const researchHandler = new ResearchHandler();

router.post(
  "/",
  authenticate,
  uploadMixedLocal.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  researchHandler.createByAdmin
);

router.put(
  "/:id",
  authenticate,
  uploadMixedLocal.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  researchHandler.updateById
);
router.get("/", researchHandler.getAll);
router.get("/title/:researchTitle", researchHandler.getByResearchTitle);

router.delete("/:id", authenticate, researchHandler.deleteById);

export default router;
