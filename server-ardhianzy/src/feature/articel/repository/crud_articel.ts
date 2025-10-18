import prisma from "../../../config/db";
import { Article, Prisma, ArticleCategory } from "@prisma/client";
import {
  SlugGenerator,
  SEOMetaGenerator,
  UtilityFactory,
} from "../../../utils/slugify";

// Interface untuk pagination
interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: keyof Article;
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

// ==== Data Contracts disesuaikan schema ====
export interface CreateArticleData {
  admin_id: string;
  title: string;
  image: string;
  content: string;
  author: string;
  date: Date;
  category: ArticleCategory; // <-- TAMBAHKAN FIELD CATEGORY (WAJIB SAAT CREATE)
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  excerpt?: string | null;
  canonical_url?: string | null;
  is_published?: boolean;
  is_featured?: boolean;
}

export interface UpdateArticleData {
  title?: string;
  slug?: string;
  image?: string;
  content?: string;
  author?: string;
  date?: Date;
  category?: ArticleCategory; // <-- TAMBAHKAN FIELD CATEGORY (OPSIONAL SAAT UPDATE)
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  excerpt?: string | null;
  canonical_url?: string | null;
  is_published?: boolean;
  is_featured?: boolean;
  view_count?: number;
}

export class ArticleRepository {
  private slugGenerator: SlugGenerator = UtilityFactory.getSlugGenerator();
  private seoGenerator: SEOMetaGenerator = UtilityFactory.getSEOGenerator();

  /**
   * Create a new Article record (Admin only)
   */
  async createByAdmin(dataArticle: CreateArticleData): Promise<Article> {
    try {
      const theDate =
        dataArticle.date instanceof Date
          ? dataArticle.date
          : new Date(dataArticle.date);

      const slug = await this.slugGenerator.generateUniqueSlug(
        dataArticle.title,
        "article"
      );

      const seoMeta = this.seoGenerator.generateSEOMeta(
        dataArticle.title,
        dataArticle.content
      );

      const newArticle = await prisma.article.create({
        data: {
          admin_id: dataArticle.admin_id,
          title: dataArticle.title,
          slug,
          image: dataArticle.image,
          content: dataArticle.content,
          author: dataArticle.author,
          date: theDate,
          category: dataArticle.category, // <-- SIMPAN CATEGORY KE DATABASE
          meta_title: dataArticle.meta_title ?? seoMeta.metaTitle,
          meta_description:
            dataArticle.meta_description ?? seoMeta.metaDescription,
          keywords: dataArticle.keywords ?? null,
          excerpt: dataArticle.excerpt ?? null,
          canonical_url: dataArticle.canonical_url ?? null,
          is_published: dataArticle.is_published ?? false,
          is_featured: dataArticle.is_featured ?? false,
        },
      });

      return newArticle;
    } catch (error) {
      throw new Error(
        `Failed to create Article: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Update Article by ID (Admin only)
   */
  async updateById(
    id: string,
    dataArticle: UpdateArticleData
  ): Promise<Article> {
    try {
      // Karena 'category' sudah ditambahkan ke UpdateArticleData,
      // spread operator (...) akan otomatis menyertakannya jika ada.
      const updateData: Prisma.ArticleUpdateInput = { ...dataArticle };

      if (dataArticle.date && !(dataArticle.date instanceof Date)) {
        updateData.date = new Date(dataArticle.date);
      }

      if (dataArticle.title && !dataArticle.slug) {
        updateData.slug = await this.slugGenerator.generateUniqueSlug(
          dataArticle.title,
          "article",
          id
        );
      }

      if (dataArticle.title || dataArticle.content) {
        // ... (logika SEO meta tetap sama)
      }

      const updatedArticle = await prisma.article.update({
        where: { id },
        data: updateData, // 'category' akan diupdate jika ada di 'updateData'
      });

      return updatedArticle;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new Error("Article not found");
      }
      throw new Error(
        `Failed to update Article: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // ... (method deleteById tidak perlu diubah) ...

  async deleteById(id: string): Promise<Article> {
    try {
      const deletedArticle = await prisma.article.delete({
        where: { id },
      });
      return deletedArticle;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new Error("Article not found");
        }
        if (error.code === "P2003") {
          throw new Error("Cannot delete Article: it has related records");
        }
      }
      throw new Error(
        `Failed to delete Article: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Get all Article records with pagination
   */
  async getAll(
    paginationParams: PaginationParams = {}
  ): Promise<PaginatedResult<Article>> {
    try {
      const page = Math.max(1, paginationParams.page ?? 1);
      const limit = Math.min(100, Math.max(1, paginationParams.limit ?? 10));
      const skip = (page - 1) * limit;

      const validSortBy: (keyof Article)[] = [
        "id",
        "title",
        "slug",
        "author",
        "date",
        "created_at",
        "updated_at",
        "is_published",
        "is_featured",
        "view_count",
        "category", // <-- TAMBAHKAN CATEGORY KE SORTING
      ];

      const sortBy = (
        paginationParams.sortBy && validSortBy.includes(paginationParams.sortBy)
          ? paginationParams.sortBy
          : "created_at"
      ) as keyof Article;

      const sortOrder = paginationParams.sortOrder ?? "desc";

      const [data, total] = await Promise.all([
        prisma.article.findMany({
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.article.count(),
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
        `Failed to get Article list: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // ... (method getByTitle tidak perlu diubah) ...

  async getByTitle(title: string): Promise<Article | null> {
    try {
      const article = await prisma.article.findFirst({
        where: { title },
      });
      return article;
    } catch (error) {
      throw new Error(
        `Failed to get Article by title: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
