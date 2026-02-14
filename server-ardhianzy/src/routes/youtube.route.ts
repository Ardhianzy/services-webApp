import { Router } from "express";
import { YoutubeHandler } from "../feature/youtube/youtube.handler";
import { YoutubeService } from "../feature/youtube/youtube.service";

import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { createYoutubeSchema, updateYoutubeSchema } from "../feature/youtube/validation";
import { uploadLimiter } from "../middleware/rateLimiter";

const router = Router();
const youtubeService = new YoutubeService();
const youtubeHandler = new YoutubeHandler(youtubeService);

router.post(
  "/",
  authenticate,
  uploadLimiter,
  validate(createYoutubeSchema),
  youtubeHandler.create.bind(youtubeHandler)
);

router.get("/latest", (req, res, next) => {
	youtubeHandler.getLatest(req, res, next).catch(next);
});

router.put(
  "/:id",
  authenticate,
  uploadLimiter,
  validate(updateYoutubeSchema),
  youtubeHandler.update.bind(youtubeHandler)
);

router.delete(
  "/:id",
  authenticate,
  youtubeHandler.delete.bind(youtubeHandler)
);
export default router;