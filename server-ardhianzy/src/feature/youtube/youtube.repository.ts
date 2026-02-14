import prisma from "../../config/db";
import { Youtube, Prisma } from "@prisma/client";
import { paginationParams, paginatedResult, createYoutubeData, updateYoutubeData,YOUTUBE_SORTABLE_FIELDS } from "./dto/youtube.dto";
export class YoutubeCrudRepo {
    private readonly sortableFields = YOUTUBE_SORTABLE_FIELDS;

    async create(data: createYoutubeData): Promise<Youtube> {
        try {
            const newYoutube = await prisma.youtube.create({
                data: { title: data.title, url: data.url, description: data.description },
            });
            return newYoutube;
        } catch (error) {
            throw new Error(
                `Failed to create Youtube record: ${ 
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }
    async getLatest(limit: number = 10): Promise<Youtube[]> {
        try {
            const youtubeRecords = await prisma.youtube.findMany({
                take: limit,
                orderBy: {
                    created_at: "desc",
                },
            });
            return youtubeRecords;
        } catch (error) {
            throw new Error(
                `Failed to fetch Youtube records: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }
    async update(id: string, data: updateYoutubeData): Promise<Youtube> {
        try {
            const updatedYoutube = await prisma.youtube.update({
                where: { id },
                data: {
                    ...data,
                },
            });
            return updatedYoutube;
        } catch (error) {
            throw new Error(
                `Failed to update Youtube record: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
}
    async getById(id: string): Promise<Youtube | null> {
        return prisma.youtube.findUnique({ where: { id } });
    }

    async delete(id: string): Promise<Youtube> {
        return prisma.youtube.delete({ where: { id } });
    }
}