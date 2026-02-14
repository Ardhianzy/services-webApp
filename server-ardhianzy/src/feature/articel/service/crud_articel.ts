import { ArticleRepository } from "../repository/crud_articel";
import { Article } from "@prisma/client";
import imagekit from "../../../libs/imageKit";
import path from "path";

// --- DTO & Interfaces ---

// DTO untuk Service Layer saat membuat artikel baru
export interface CreateArticleServiceData {
  title: string;
  content: string;
  author: string;
  date: Date | string;

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
    // Don't spread body - it already has correctly parsed booleans from handler
    const updateData: any = {};

    // Copy fields individually (optional fields only if defined)
    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.author !== undefined) updateData.author = body.author;
    if (body.meta_title !== undefined) updateData.meta_title = body.meta_title;
    if (body.meta_description !== undefined) updateData.meta_description = body.meta_description;
    if (body.keywords !== undefined) updateData.keywords = body.keywords;
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.canonical_url !== undefined) updateData.canonical_url = body.canonical_url;
    if (body.view_count !== undefined) updateData.view_count = body.view_count;
    
    // Preserve boolean values that were already parsed in handler
    if (body.is_published !== undefined) updateData.is_published = body.is_published;
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured;

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

  async getById(id: string): Promise<Article | null> {
      // Perlu implementasi di repo jika belum ada, atau pakai prisma langsung di repo.
      // Cek repository dulu apakah ada getById.
      // Di view sebelumnya, repository punya updateById yang pake prisma.article.update({where: {id}}).
      // Sebaiknya kita tambahkan getById di Repo juga jika belum ada.
      // Tapi tunggu, repo.updateById throws P2025 if not found.
      // Kita butuh getById untuk cek admin_id.
      // Cek repo file content di step 190.
      // Repo punya createByAdmin, updateById, deleteById, getAll, getByTitle, getByArticelCategory.
      // Tidak ada getById by ID.
      // Saya harus tambah getById di Repo dulu.
      // Tapi saya di sini edit service.
      // Saya akan tambahkan getById di service yang memanggil repo.getById (yang akan saya buat).
      return this.repo.getById(id);
  }

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

}
