// src/handler/youtube.handler.ts
import { Request, Response, NextFunction } from "express";
import { YoutubeService } from "./youtube.service"; // Sesuaikan path
import { createYoutubeData, updateYoutubeData } from "./dto/youtube.dto"; // Sesuaikan path

export class YoutubeHandler {
    private youtubeService: YoutubeService;

    constructor(youtubeService: YoutubeService) {
        this.youtubeService = youtubeService;
    }


    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: createYoutubeData = req.body;

            const newYoutube = await this.youtubeService.create(data);

            res.status(201).json({
                message: "Youtube record created successfully",
                data: newYoutube,
            });
        } catch (error) {
            next(error);
        }
    };


    public getLatest = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

            if (isNaN(limit)) {
                return res.status(400).json({ message: "Query 'limit' must be a number" });
            }

            const youtubeRecords = await this.youtubeService.getLatest(limit);

            res.status(200).json({
                message: "Latest Youtube records fetched successfully",
                data: youtubeRecords,
            });
        } catch (error) {
            next(error);
        }
    };


    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const data: updateYoutubeData = req.body;

            const updatedYoutube = await this.youtubeService.update(id, data);

            res.status(200).json({
                message: "Youtube record updated successfully",
                data: updatedYoutube,
            });
        } catch (error) {
            next(error);
        }
    };
}