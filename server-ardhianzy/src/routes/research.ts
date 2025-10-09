// src/routes/research.ts
import { Router } from "express";
import { ResearchHandler } from "../feature/research/handler/crud_res";
import { authenticate } from "../middleware/authenticate";
import upload from "../middleware/multer"; // ← middleware gambar kamu (single("image"))
import { uploadPdf } from "../middleware/multerPdf"; // ← middleware PDF (single("pdf"))

const router = Router();
const researchHandler = new ResearchHandler();

// Create Research (Admin only)
// - image: field name "image" (opsi kamu sebelumnya)
// - pdf:   field name "pdf"   (opsional, max 10 MB)
router.post(
  "/",
  authenticate,
  (req, res, next) => upload.single("image")(req, res, next),
  (req, res, next) => uploadPdf.single("pdf")(req, res, next),
  researchHandler.createByAdmin
);

// Get all Research with pagination
router.get("/", researchHandler.getAll);

// Get Research by research title
router.get("/title/:researchTitle", researchHandler.getByResearchTitle);

// Update Research by ID (Admin only)
// - boleh kirim image baru dan/atau pdf baru
// - untuk hapus PDF tanpa upload baru: kirim body `remove_pdf=true`
router.put(
  "/:id",
  authenticate,
  (req, res, next) => upload.single("image")(req, res, next),
  (req, res, next) => uploadPdf.single("pdf")(req, res, next),
  researchHandler.updateById
);

// Delete Research by ID (Admin only)
router.delete("/:id", authenticate, researchHandler.deleteById);

export default router;
