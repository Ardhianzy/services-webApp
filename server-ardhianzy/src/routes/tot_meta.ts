import { Router } from "express";
import { ToTMetaHandler } from "../feature/ToT_meta/handler/crud";
import { authenticate } from "../middleware/authenticate"; // Update path ini

import { validate } from "../middleware/validate";
import { createToTMetaSchema, updateToTMetaSchema } from "../feature/ToT_meta/validation";
import { uploadLimiter } from "../middleware/rateLimiter";

const router = Router();
const totMetaHandler = new ToTMetaHandler();

// Create ToT Meta (Admin only)
router.post(
  "/",
  authenticate,
  uploadLimiter,
  validate(createToTMetaSchema),
  totMetaHandler.createByAdmin
);

// Get all ToT Meta with pagination
router.get("/", totMetaHandler.getAll);

// Get ToT Meta by ToT ID
router.get("/tot/:totId", totMetaHandler.getByToTId);

// Get ToT Meta by ID
router.get("/:id", totMetaHandler.getById);

// Update ToT Meta by ID (Admin only)
router.put(
  "/:id",
  authenticate,
  uploadLimiter,
  validate(updateToTMetaSchema),
  totMetaHandler.updateById
);

// Delete ToT Meta by ID (Admin only)
router.delete("/:id", authenticate, totMetaHandler.deleteById);

export default router;
