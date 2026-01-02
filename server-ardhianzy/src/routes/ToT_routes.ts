import { Router } from "express";
import { TotHandler } from "../feature/ToT/handler/crud";
import { authenticate } from "../middleware/authenticate";
import upload from "../middleware/multer";

import { validate } from "../middleware/validate";
import { createToTSchema, updateToTSchema } from "../feature/ToT/validation";
import { uploadLimiter } from "../middleware/rateLimiter";

const router = Router();
const totHandler = new TotHandler();

// Public routes (tidak perlu login)
router.get("/", totHandler.getAllToT);
router.get("/:id", totHandler.getTotById);

// Protected routes (perlu login admin)
router.post(
  "/",
  authenticate,
  uploadLimiter,
  upload.single("image"),
  validate(createToTSchema),
  totHandler.createToT
);
router.put(
  "/:id",
  authenticate,
  uploadLimiter,
  upload.single("image"),
  validate(updateToTSchema),
  totHandler.updateToT
);
router.delete("/:id", authenticate, totHandler.deleteToT);

export default router;
