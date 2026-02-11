import { Router } from "express";
import { MonologuesHandler } from "../feature/Monologues/handler/crud_handler"; // Pastikan path ini benar
import { authenticate } from "../middleware/authenticate";
import { uploadMixedLocal } from "../middleware/multerPdf";
import { validate } from "../middleware/validate";
import { createMonologueSchema, updateMonologueSchema } from "../feature/Monologues/validation";
import { uploadLimiter } from "../middleware/rateLimiter";

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
  uploadLimiter,
  handleFiles, // Gunakan middleware yang sudah didefinisikan
  validate(createMonologueSchema),
  monologuesHandler.createByAdmin
);

// Memperbarui Monologue berdasarkan ID
router.put(
  "/:id",
  authenticate,
  uploadLimiter,
  handleFiles, // Gunakan middleware yang sama untuk update
  validate(updateMonologueSchema),
  monologuesHandler.updateById
);

// Menghapus Monologue berdasarkan ID
router.delete("/:id", authenticate, monologuesHandler.deleteById);

// === PUBLIC ROUTES ===

// Mendapatkan semua Monologues dengan paginasi
router.get("/", monologuesHandler.getAll);

// Mendapatkan satu Monologue berdasarkan ID (khusus Admin/Edit)
// Regex ini memastikan ID memiliki minimal 20 karakter alphanumeric (seperti CUID/UUID)
// agar tidak bertabrakan dengan slug yang mungkin pendek
// Regex dihapus untuk kompatibilitas Express 5. Validasi ID dilakukan di handler.
router.get("/:id", monologuesHandler.getById.bind(monologuesHandler));

// Mendapatkan satu Monologue berdasarkan slug-nya (lebih baik untuk SEO)
router.get("/:slug", monologuesHandler.findBySlug);

export default router;
