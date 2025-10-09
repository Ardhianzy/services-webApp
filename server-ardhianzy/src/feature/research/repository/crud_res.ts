import prisma from "../../../config/db";
import { Research, Prisma } from "@prisma/client";
import {
  SlugGenerator,
  SEOMetaGenerator,
  UtilityFactory,
} from "../../../utils/slugify";

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

export type PdfMeta = {
  pdf_file_id: string;
  pdf_url: string;
  pdf_filename: string;
  pdf_mime: string;
  pdf_size: number;
  pdf_uploaded_at: Date;
};

export interface CreateResearchData {
  admin_id: string;
  research_title: string;
  research_sum: string;
  image: string;
  researcher: string;
  research_date: Date;
  fiel: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  is_published?: boolean;

  // PDF (opsional)
  pdf_file_id?: string;
  pdf_url?: string;
  pdf_filename?: string;
  pdf_mime?: string;
  pdf_size?: number;
  pdf_uploaded_at?: Date;
}

export interface UpdateResearchData {
  research_title?: string;
  slug?: string;
  research_sum?: string;
  image?: string;
  researcher?: string;
  research_date?: Date;
  fiel?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  is_published?: boolean;

  // PDF (opsional)
  pdf_file_id?: string | null;
  pdf_url?: string | null;
  pdf_filename?: string | null;
  pdf_mime?: string | null;
  pdf_size?: number | null;
  pdf_uploaded_at?: Date | null;
}

export class ResearchRepository {
  private slugGenerator: SlugGenerator = UtilityFactory.getSlugGenerator();
  private seoGenerator: SEOMetaGenerator = UtilityFactory.getSEOGenerator();

  private readonly sortableFields = new Set<keyof Research | string>([
    "id",
    "research_title",
    "researcher",
    "research_date",
    "slug",
    "is_published",
    "created_at",
    "updated_at",
  ]);

  /**
   * Create a new Research record (Admin only)
   */
  async createByAdmin(dataResearch: CreateResearchData): Promise<Research> {
    try {
      const slug = await this.slugGenerator.generateUniqueSlug(
        dataResearch.research_title,
        "research"
      );

      const seoMeta = this.seoGenerator.generateSEOMeta(
        dataResearch.research_title,
        dataResearch.research_sum
      );

      const newResearch = await prisma.research.create({
        data: {
          ...dataResearch,
          slug,
          meta_title: dataResearch.meta_title ?? seoMeta.metaTitle,
          meta_description:
            dataResearch.meta_description ?? seoMeta.metaDescription,
        },
      });
      return newResearch;
    } catch (error) {
      throw new Error(
        `Failed to create Research: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Update Research by ID (Admin only)
   * - Jika `research_title` berubah → regenerate slug (unique, exclude id)
   * - Jika title/summary berubah & meta kosong → regenerate SEO meta
   * - Untuk PDF:
   *   - kirim seluruh kolom pdf_* untuk REPLACE PDF
   *   - kirim pdf_* = null untuk CLEAR PDF (DB saja; file sudah dihapus di handler)
   */
  async updateById(
    id: string,
    dataResearch: UpdateResearchData
  ): Promise<Research> {
    try {
      let updateData: UpdateResearchData = { ...dataResearch };

      if (dataResearch.research_title) {
        updateData.slug = await this.slugGenerator.generateUniqueSlug(
          dataResearch.research_title,
          "research",
          id
        );
      }

      if (dataResearch.research_title || dataResearch.research_sum) {
        const current = await prisma.research.findUnique({ where: { id } });
        if (current) {
          const title = dataResearch.research_title ?? current.research_title;
          const summary = dataResearch.research_sum ?? current.research_sum;
          const seoMeta = this.seoGenerator.generateSEOMeta(title, summary);
          if (typeof dataResearch.meta_title === "undefined") {
            updateData.meta_title = seoMeta.metaTitle;
          }
          if (typeof dataResearch.meta_description === "undefined") {
            updateData.meta_description = seoMeta.metaDescription;
          }
        }
      }

      const updated = await prisma.research.update({
        where: { id },
        data: updateData,
      });

      return updated;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("Research not found");
      }
      throw new Error(
        `Failed to update Research: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Delete Research by ID (Admin only)
   * - Disarankan: handler menghapus file PDF di ImageKit jika `pdf_file_id` ada
   *   sebelum memanggil repository.deleteById
   */
  async deleteById(id: string): Promise<Research> {
    try {
      const deleted = await prisma.research.delete({ where: { id } });
      return deleted;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new Error("Research not found");
        if (error.code === "P2003")
          throw new Error("Cannot delete Research: it has related records");
      }
      throw new Error(
        `Failed to delete Research: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getAll(
    paginationParams: PaginationParams = {}
  ): Promise<PaginatedResult<Research>> {
    try {
      const page = Math.max(1, paginationParams.page ?? 1);
      const limit = Math.min(100, Math.max(1, paginationParams.limit ?? 10));
      const skip = (page - 1) * limit;

      const sortByRaw = paginationParams.sortBy ?? "created_at";
      const sortBy = this.sortableFields.has(sortByRaw)
        ? (sortByRaw as keyof Research)
        : ("created_at" as keyof Research);

      const sortOrder = paginationParams.sortOrder ?? "desc";

      const [data, total] = await Promise.all([
        prisma.research.findMany({
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder } as any,
        }),
        prisma.research.count(),
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
        `Failed to get Research list: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async getByResearchTitle(researchTitle: string): Promise<Research | null> {
    try {
      const research = await prisma.research.findFirst({
        where: { research_title: researchTitle },
      });
      return research;
    } catch (error) {
      throw new Error(
        `Failed to get Research by research title: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
