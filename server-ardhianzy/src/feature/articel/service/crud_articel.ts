import { ArticleRepository } from "../repository/crud_articel";
import { Article, ArticleCategory } from "@prisma/client"; // Impor enum ArticleCategory
import imagekit from "../../../libs/imageKit";
import path from "path";

// --- DTO & Interfaces ---

// DTO untuk Service Layer saat membuat artikel baru
export interface CreateArticleServiceData {
  title: string;
  content: string;
  author: string;
  date: Date | string;
  category: ArticleCategory; // <-- TAMBAHKAN: Kategori wajib ada
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  excerpt?: string | null;
  canonical_url?: string | null;
  is_published?: boolean;
  is_featured?: boolean;
  admin_id: string;
}

// DTO untuk Service Layer saat memperbarui artikel
export interface UpdateArticleServiceData {
  title?: string;
  content?: string;
  author?: string;
  date?: Date | string;
  category?: ArticleCategory; // <-- TAMBAHKAN: Kategori opsional saat update
  meta_title?: string | null;
  meta_description?: string | null;
  keywords?: string | null;
  excerpt?: string | null;
  canonical_url?: string | null;
  is_published?: boolean;
  is_featured?: boolean;
  view_count?: number;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: keyof Article;
  sortOrder?: "asc" | "desc";
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    /* ... */
  };
}

// --- Service Class ---

export class ArticleService {
  private repo: ArticleRepository;

  constructor() {
    this.repo = new ArticleRepository();
  }

  /**
   * Create Article (Admin only)
   * @param body - Data artikel dari handler
   * @param imageFile - File gambar dari handler (wajib)
   */
  async createByAdmin(
    body: CreateArticleServiceData,
    imageFile: Express.Multer.File
  ): Promise<Article> {
    // Validasi input
    if (!body.title?.trim()) throw new Error("Title is required");
    if (!body.content?.trim()) throw new Error("Content is required");
    if (!body.author?.trim()) throw new Error("Author is required");
    if (!body.date) throw new Error("Date is required");
    if (!body.admin_id?.trim()) throw new Error("Admin ID is required");
    if (!imageFile) throw new Error("Image is required");

    // Validasi category enum
    if (
      !body.category ||
      !Object.values(ArticleCategory).includes(body.category)
    ) {
      throw new Error(
        `A valid category is required. Valid options are: ${Object.values(
          ArticleCategory
        ).join(", ")}`
      );
    }

    // Upload image
    let imageUrl: string;
    try {
      const response = await imagekit.upload({
        fileName: Date.now() + path.extname(imageFile.originalname),
        file: imageFile.buffer,
        folder: "/website-ardhianzy/articles", // Folder spesifik untuk artikel
        useUniqueFileName: true,
      });
      imageUrl = response.url;
    } catch {
      throw new Error("Failed to upload image");
    }

    // Panggil repository dengan data yang sudah lengkap
    return this.repo.createByAdmin({
      ...body,
      image: imageUrl, // Ganti file dengan URL hasil upload
      date: new Date(body.date),
    });
  }

  /**
   * Update Article by ID (Admin only)
   * @param id - ID artikel
   * @param body - Data artikel untuk diupdate
   * @param imageFile - File gambar baru (opsional)
   */
  async updateById(
    id: string,
    body: UpdateArticleServiceData,
    imageFile?: Express.Multer.File
  ): Promise<Article> {
    const updateData: any = { ...body };

    // Validasi category enum jika ada
    if (
      body.category &&
      !Object.values(ArticleCategory).includes(body.category)
    ) {
      throw new Error(
        `Invalid category provided. Valid options are: ${Object.values(
          ArticleCategory
        ).join(", ")}`
      );
    }

    // Upload image baru jika ada
    if (imageFile) {
      try {
        const response = await imagekit.upload({
          fileName: Date.now() + path.extname(imageFile.originalname),
          file: imageFile.buffer,
          folder: "/website-ardhianzy/articles",
          useUniqueFileName: true,
        });
        updateData.image = response.url;
      } catch {
        throw new Error("Failed to upload new image");
      }
    }

    // Normalisasi date jika ada
    if (body.date) {
      updateData.date = new Date(body.date);
    }

    // Delegasikan ke repository
    return this.repo.updateById(id, updateData);
  }

  // --- Metode Passthrough (hanya meneruskan ke Repository) ---

  async deleteById(id: string): Promise<Article> {
    return this.repo.deleteById(id);
  }

  async getAll(
    paginationParams?: PaginationParams
  ): Promise<PaginatedResult<Article>> {
    return this.repo.getAll(paginationParams || {});
  }

  async getByTitle(title: string): Promise<Article> {
    const article = await this.repo.getByTitle(title);
    if (!article) {
      throw new Error("Article not found");
    }
    return article;
  }
  async getByArticleCategory(
    category: ArticleCategory,
    paginationParams?: PaginationParams
  ): Promise<PaginatedResult<Article>> {
    const result = await this.repo.getByArticelCategory(
      category,
      paginationParams || {}
    );
    if (!result || result.length === 0)
      throw new Error("No articles found for the specified category");
    
    return {
      data: result,
      pagination: {
        total: result.length,
        page: paginationParams?.page || 1,
        limit: paginationParams?.limit || 10
      }
    };
  }
}
