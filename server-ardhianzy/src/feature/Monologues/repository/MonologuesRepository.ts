import prisma from "../../../config/db";
import { Monologues, Prisma } from "@prisma/client";
import {
  SlugGenerator,
  SEOMetaGenerator,
  UtilityFactory,
} from "../../../utils/slugify"; // Pastikan path ini sesuai

// --- Generic Interfaces (bisa dipindahkan ke file terpisah jika digunakan di banyak tempat) ---

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

// --- Interfaces Spesifik untuk Monologues ---

export interface CreateMonologueData {
  admin_id: string;
  title: string;
  dialog: string;
  judul: string; // Field ini ada di schema, mungkin memiliki fungsi spesifik
  image?: string;
  meta_title?: string;
  meta_description?: string;
  is_published?: boolean;

  // PDF (opsional)
  pdf_file_id?: string;
  pdf_url?: string;
  pdf_filename?: string;
  pdf_mime?: string;
  pdf_size?: number;
  pdf_uploaded_at?: Date;
}

export interface UpdateMonologueData {
  title?: string;
  slug?: string;
  dialog?: string;
  judul?: string;
  image?: string;
  meta_title?: string;
  meta_description?: string;
  is_published?: boolean;

  // PDF (opsional, bisa di-clear dengan null)
  pdf_file_id?: string | null;
  pdf_url?: string | null;
  pdf_filename?: string | null;
  pdf_mime?: string | null;
  pdf_size?: number | null;
  pdf_uploaded_at?: Date | null;
}

// --- Repository Class ---

export class MonologuesRepository {
  private slugGenerator: SlugGenerator = UtilityFactory.getSlugGenerator();
  private seoGenerator: SEOMetaGenerator = UtilityFactory.getSEOGenerator();

  // Daftar field yang aman untuk di-sort
  private readonly sortableFields = new Set<keyof Monologues | string>([
    "id",
    "title",
    "judul",
    "slug",
    "is_published",
    "created_at",
    "updated_at",
  ]);

  /**
   * Membuat record Monologue baru (Admin only).
   * - Slug dan meta SEO akan digenerate otomatis jika tidak disediakan.
   */
  async createByAdmin(dataMonologue: CreateMonologueData): Promise<Monologues> {
    try {
      const slug = await this.slugGenerator.generateUniqueSlug(
        dataMonologue.title,
        "monologues" // Menggunakan nama tabel/model untuk memastikan keunikan
      );

      // Gunakan 'title' dan 'dialog' untuk generate SEO meta
      const seoMeta = this.seoGenerator.generateSEOMeta(
        dataMonologue.title,
        dataMonologue.dialog
      );

      const newMonologue = await prisma.monologues.create({
        data: {
          ...dataMonologue,
          slug,
          meta_title: dataMonologue.meta_title ?? seoMeta.metaTitle,
          meta_description:
            dataMonologue.meta_description ?? seoMeta.metaDescription,
        },
      });
      return newMonologue;
    } catch (error) {
      throw new Error(
        `Failed to create Monologue: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Memperbarui Monologue berdasarkan ID (Admin only).
   * - Jika 'title' berubah, slug akan digenerate ulang.
   * - Jika 'title' atau 'dialog' berubah & meta kosong, SEO meta akan digenerate ulang.
   * - PDF bisa diganti (kirim data lengkap) atau dihapus (kirim null).
   */
  async updateById(
    id: string,
    dataMonologue: UpdateMonologueData
  ): Promise<Monologues> {
    try {
      let updateData: UpdateMonologueData = { ...dataMonologue };

      // Generate ulang slug jika title berubah
      if (dataMonologue.title) {
        updateData.slug = await this.slugGenerator.generateUniqueSlug(
          dataMonologue.title,
          "monologues",
          id // Exclude ID saat ini dari pengecekan unik
        );
      }

      // Generate ulang SEO meta jika title/dialog berubah dan meta tidak diisi manual
      if (dataMonologue.title || dataMonologue.dialog) {
        const current = await prisma.monologues.findUnique({ where: { id } });
        if (current) {
          const title = dataMonologue.title ?? current.title;
          const dialog = dataMonologue.dialog ?? current.dialog;
          const seoMeta = this.seoGenerator.generateSEOMeta(title, dialog);

          if (typeof dataMonologue.meta_title === "undefined") {
            updateData.meta_title = seoMeta.metaTitle;
          }
          if (typeof dataMonologue.meta_description === "undefined") {
            updateData.meta_description = seoMeta.metaDescription;
          }
        }
      }

      const updated = await prisma.monologues.update({
        where: { id },
        data: updateData,
      });

      return updated;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new Error("Monologue not found");
      }
      throw new Error(
        `Failed to update Monologue: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Menghapus Monologue berdasarkan ID (Admin only).
   * File PDF terkait harus dihapus di level service/handler sebelum memanggil method ini.
   */
  async deleteById(id: string): Promise<Monologues> {
    try {
      const deleted = await prisma.monologues.delete({ where: { id } });
      return deleted;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") throw new Error("Monologue not found");
        if (error.code === "P2003")
          throw new Error("Cannot delete Monologue: it has related records");
      }
      throw new Error(
        `Failed to delete Monologue: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Mendapatkan semua Monologues dengan paginasi dan sorting.
   */
  async getAll(
    paginationParams: PaginationParams = {}
  ): Promise<PaginatedResult<Monologues>> {
    try {
      const page = Math.max(1, paginationParams.page ?? 1);
      const limit = Math.min(100, Math.max(1, paginationParams.limit ?? 10));
      const skip = (page - 1) * limit;

      const sortByRaw = paginationParams.sortBy ?? "created_at";
      const sortBy = this.sortableFields.has(sortByRaw)
        ? (sortByRaw as keyof Monologues)
        : ("created_at" as keyof Monologues);

      const sortOrder = paginationParams.sortOrder ?? "desc";

      const [data, total] = await Promise.all([
        prisma.monologues.findMany({
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder } as any,
        }),
        prisma.monologues.count(),
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
        `Failed to get Monologues list: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Mendapatkan satu Monologue berdasarkan slug-nya.
   * Ini adalah cara yang paling umum untuk mengambil data tunggal untuk halaman detail.
   */
  async findBySlug(slug: string): Promise<Monologues | null> {
    try {
      const monologue = await prisma.monologues.findUnique({
        where: { slug },
      });
      return monologue;
    } catch (error) {
      throw new Error(
        `Failed to get Monologue by slug: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
