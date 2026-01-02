import { YoutubeCrudRepo } from "./youtube.repository";
import { Youtube } from "@prisma/client";
import { createYoutubeData, updateYoutubeData } from "./dto/youtube.dto";

export class YoutubeService {
    private youtubeRepo: YoutubeCrudRepo;
    constructor() {
        this.youtubeRepo = new YoutubeCrudRepo();
    }

    async create(data: createYoutubeData): Promise<Youtube> {
        try {
            const newYoutube = await this.youtubeRepo.create(data);
            return newYoutube;
        } catch (error) {
            throw new Error(
                `Failed to create Youtube record: ${error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }
    async getLatest(limit: number = 10): Promise<Youtube[]> {
        try {
            const youtubeRecords = await this.youtubeRepo.getLatest(limit);
            return youtubeRecords;
        } catch (error) {
            throw new Error(
                `Failed to fetch Youtube records: ${error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    async update(id: string, data: updateYoutubeData): Promise<Youtube> {
        try {
            const updatedYoutube = await this.youtubeRepo.update(id, data);
            return updatedYoutube;
        } catch (error) {
            throw new Error(
                `Failed to update Youtube record: ${error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }
    async getById(id: string): Promise<Youtube | null> {
        return this.youtubeRepo.getById(id);
    }
    async delete(id: string): Promise<Youtube> {
        return this.youtubeRepo.delete(id);
    }
}
