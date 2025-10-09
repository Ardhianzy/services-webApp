import multer from "multer";

const storage = multer.memoryStorage();
const MAX_10MB = 10 * 1024 * 1024;

export const uploadPdf = multer({
  storage,
  limits: { fileSize: MAX_10MB },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") return cb(null, true);
    // izinkan sebagian browser kirim 'application/octet-stream' + cek header di handler
    if (file.mimetype === "application/octet-stream") return cb(null, true);
    cb(new Error("Hanya file PDF yang diperbolehkan"));
  },
});