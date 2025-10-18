import { Router } from "express";
import { MonologuesHandler } from "../feature/Monologues/handler/crud_handler"; // Pastikan path ini benar
import { authenticate } from "../middleware/authenticate";
import { uploadMixedLocal } from "../middleware/multerPdf";
const router = Router();
const monologuesHandler = new MonologuesHandler();

// Middleware untuk menangani uploadMixedLocal file gambar dan PDF sekaligus.
const handleFiles = uploadMixedLocal.fields([
  { name: "image", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]);

// === ADMIN ROUTES (membutuhkan autentikasi) ===

// Membuat Monologue baru
router.post(
  "/",
  authenticate,
  handleFiles, // Gunakan middleware yang sudah didefinisikan
  monologuesHandler.createByAdmin
);

// Memperbarui Monologue berdasarkan ID
router.put(
  "/:id",
  authenticate,
  handleFiles, // Gunakan middleware yang sama untuk update
  monologuesHandler.updateById
);

// Menghapus Monologue berdasarkan ID
router.delete("/:id", authenticate, monologuesHandler.deleteById);

// === PUBLIC ROUTES ===

// Mendapatkan semua Monologues dengan paginasi
router.get("/", monologuesHandler.getAll);

// Mendapatkan satu Monologue berdasarkan slug-nya (lebih baik untuk SEO)
router.get("/:slug", monologuesHandler.findBySlug);

export default router;
