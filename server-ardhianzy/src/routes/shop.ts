import { Router } from "express";
import { ShopHandler } from "../feature/shop/handler/crud_shop";
import { authenticate } from "../middleware/authenticate";
import upload from "../middleware/multer";

import { validate } from "../middleware/validate";
import { createShopSchema, updateShopSchema } from "../feature/shop/validation";
import { uploadLimiter } from "../middleware/rateLimiter";

const router = Router();
const shopHandler = new ShopHandler();

router.post(
  "/",
  authenticate,
  uploadLimiter,
  upload.single("image"),
  validate(createShopSchema),
  shopHandler.create.bind(shopHandler)
);

router.get("/title/:title", shopHandler.getByTitle.bind(shopHandler));

router.get("/", shopHandler.getAll.bind(shopHandler));

router.delete("/:id", authenticate, shopHandler.deleteById.bind(shopHandler));

router.get("/:id", shopHandler.getById.bind(shopHandler));

router.put(
  "/:id",
  authenticate,
  uploadLimiter,
  upload.single("image"),
  validate(updateShopSchema),
  shopHandler.updateById.bind(shopHandler)
);

export default router;
