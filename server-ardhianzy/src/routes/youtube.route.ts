import { Router } from "express";
import { YoutubeHandler } from "../feature/youtube/youtube.handler";
import { YoutubeService } from "../feature/youtube/youtube.service";

const router = Router();
const youtubeService = new YoutubeService();
const youtubeHandler = new YoutubeHandler(youtubeService);
router.post("/", youtubeHandler.create.bind(youtubeHandler));
router.get("/latest", (req, res, next) => {
	youtubeHandler.getLatest(req, res, next).catch(next);
});
router.put("/:id", youtubeHandler.update.bind(youtubeHandler));
export default router;