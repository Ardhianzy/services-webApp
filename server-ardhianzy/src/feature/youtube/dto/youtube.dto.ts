import { Youtube } from "@prisma/client";
export interface paginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface paginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
export interface createYoutubeData {
  title: string;
  url: string;
  description: string;
}

export interface updateYoutubeData {
  title?: string;
  url?: string;
  description?: string;
}
export class YOUTUBE_SORTABLE_FIELDS {
  private readonly sortableFields = new Set<keyof Youtube | string>([
    "id",
    "title",
    "url",
    "description",
    "created_at",
  ]);
}