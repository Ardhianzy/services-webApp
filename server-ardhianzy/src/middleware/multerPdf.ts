// src/middleware/mixedLocal.ts
import multer from "multer";

const storage = multer.memoryStorage(); // sama seperti yang kamu pakai

export const uploadMixedLocal = multer({
  storage,
  limits: {
    files: 2, // agar boleh 2 file (image + pdf)
    fileSize: 20 * 1024 * 1024, // batas global 20MB (opsional)
  },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === "image") {
      const ok = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ].includes(file.mimetype);
      return ok
        ? cb(null, true)
        : cb(new Error("Only JPEG/PNG/JPG/WebP for field 'image'"));
    }
    if (file.fieldname === "pdf") {
      return file.mimetype === "application/pdf"
        ? cb(null, true)
        : cb(new Error("Only PDF for field 'pdf'"));
    }
    // Tolak field file lain
    return cb(new Error(`Unexpected file field: ${file.fieldname}`));
  },
});
