import prisma from "../../../config/db";
import { ToT_meta, Prisma } from "@prisma/client";

// Interface untuk pagination (Tidak ada perubahan)
interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface PaginatedResult<T> {
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
export interface CreateToTMetaData {
  ToT_id: string;
  metafisika: string;
  epsimologi: string;
  aksiologi: string;
  conclusion: string;
  is_published?: boolean;
}

export interface UpdateToTMetaData {
  ToT_id?: string;
  metafisika?: string;
  epsimologi?: string;
  aksiologi?: string;
  conclusion?: string;
  is_published?: boolean;
}

export class ToTMetaRepository {
  async createByAdmin(dataToTMeta: CreateToTMetaData): Promise<ToT_meta> {
    try {
      const totExists = await prisma.toT.findUnique({
        where: { id: dataToTMeta.ToT_id },
      });
      if (!totExists) {
        throw new Error(
          "ToT not found. Cannot create ToT Meta for non-existent ToT."
        );
      }

      const newToTMeta = await prisma.toT_meta.create({
        data: dataToTMeta,
        include: {
          tot: {
            select: {
              id: true,
              philosofer: true,
              geoorigin: true,
              years: true,
            },
          },
        },
      });
      return newToTMeta;
    } catch (error) {
      throw new Error(
        `Failed to create ToT Meta: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async updateById(
    id: string,
    dataToTMeta: UpdateToTMetaData
  ): Promise<ToT_meta> {
    try {
      if (dataToTMeta.ToT_id) {
        const totExists = await prisma.toT.findUnique({
          where: { id: dataToTMeta.ToT_id },
        });

        if (!totExists) {
          throw new Error(
            "ToT not found. Cannot update ToT Meta with non-existent ToT."
          );
        }
      }

      const updatedToTMeta = await prisma.toT_meta.update({
        where: { id },
        data: dataToTMeta,
        include: {
          tot: {
            select: {
              id: true,
              philosofer: true,
              geoorigin: true,
              years: true,
            },
          },
        },
      });

      return updatedToTMeta;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new Error("ToT Meta not found");
        }
      }
      throw new Error(
        `Failed to update ToT Meta: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Delete ToT Meta by ID (Admin only)
   * @param id - ID dari ToT Meta yang akan dihapus
   * @returns Promise<ToT_meta> - Record ToT Meta yang telah dihapus
   */
  // CHANGED: Tipe 'id' diubah dari number menjadi string
  async deleteById(id: string): Promise<ToT_meta> {
    try {
      const deletedToTMeta = await prisma.toT_meta.delete({
        where: { id },
        include: {
          tot: {
            select: {
              id: true,
              philosofer: true,
              geoorigin: true,
              years: true,
            },
          },
        },
      });

      return deletedToTMeta;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new Error("ToT Meta not found");
        }
        if (error.code === "P2003") {
          throw new Error("Cannot delete ToT Meta: it has related records");
        }
      }
      throw new Error(
        `Failed to delete ToT Meta: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get all ToT Meta records with pagination (Tidak ada perubahan)
   */
  async getAll(
    paginationParams: PaginationParams = {}
  ): Promise<PaginatedResult<ToT_meta>> {
    try {
      const page = Math.max(1, paginationParams.page || 1);
      const limit = Math.min(100, Math.max(1, paginationParams.limit || 10));
      const skip = (page - 1) * limit;
      const sortBy = paginationParams.sortBy || "id";
      const sortOrder = paginationParams.sortOrder || "desc";

      const [data, total] = await Promise.all([
        prisma.toT_meta.findMany({
          skip,
          take: limit,
          orderBy: {
            [sortBy]: sortOrder,
          },
          include: {
            tot: {
              select: {
                id: true,
                philosofer: true,
                geoorigin: true,
                years: true,
              },
            },
          },
        }),
        prisma.toT_meta.count(),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to get ToT Meta list: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get ToT Meta by ToT ID
   * @param totId - ToT ID dari ToT Meta yang ingin diambil
   * @returns Promise<ToT_meta[]> - Array of ToT Meta records untuk ToT tertentu
   */
  // CHANGED: Tipe 'totId' diubah dari number menjadi string
  async getByToTId(totId: string): Promise<ToT_meta[]> {
    try {
      const totMeta = await prisma.toT_meta.findMany({
        where: { ToT_id: totId },
        include: {
          tot: {
            select: {
              id: true,
              philosofer: true,
              geoorigin: true,
              years: true,
            },
          },
        },
      });
      return totMeta;
    } catch (error) {
      throw new Error(
        `Failed to get ToT Meta by ToT ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get ToT Meta by ID
   * @param id - ID dari ToT Meta yang ingin diambil
   * @returns Promise<ToT_meta | null> - Record ToT Meta atau null jika tidak ditemukan
   */
  // CHANGED: Tipe 'id' diubah dari number menjadi string
  async getById(id: string): Promise<ToT_meta | null> {
    try {
      const totMeta = await prisma.toT_meta.findUnique({
        where: { id },
        include: {
          tot: {
            select: {
              id: true,
              philosofer: true,
              geoorigin: true,
              years: true,
              admin_id: true,
            },
          },
        },
      });
      return totMeta;
    } catch (error) {
      throw new Error(
        `Failed to get ToT Meta by ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
