import { Router } from "express";
import { ArticleHandler } from "../feature/articel/handler/crud_articel";
import { authenticate } from "../middleware/authenticate";
import upload from "../middleware/multer";

import { validate } from "../middleware/validate";
import { createArticleSchema, updateArticleSchema } from "../feature/articel/validation";
import { uploadLimiter } from "../middleware/rateLimiter";

const router = Router();
const articleHandler = new ArticleHandler();

// Create Article (Admin only)
router.post(
  "/",
  authenticate,
  uploadLimiter,
  upload.single("image"),
  validate(createArticleSchema),
  articleHandler.createByAdmin
);

// Get all Article with pagination
router.get("/", articleHandler.getAll);

// Get Article by title
router.get("/title/:title", articleHandler.getByTitle);

// Update Article by ID (Admin only)
router.put(
  "/:id",
  authenticate,
  uploadLimiter,
  upload.single("image"),
  validate(updateArticleSchema),
  articleHandler.updateById
);
// Delete Article by ID (Admin only)
router.delete("/:id", authenticate, articleHandler.deleteById);

export default router;
