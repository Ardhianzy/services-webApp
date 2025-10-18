import prisma from "../../../config/db";
import { Megazine, Prisma } from "@prisma/client";
import {
  SlugGenerator,
  SEOMetaGenerator,
  UtilityFactory,
} from "../../../utils/slugify"; // Pastikan path ini sesuai dengan struktur proyek Anda

// --- Generic Interfaces (bisa dipindahkan ke file terpisah) ---

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

// --- Interfaces Spesifik untuk Megazine ---

export interface CreateMegazineData {
  admin_id: string;
  title: string;
  description: string;
  megazine_isi: string;
  image: string; // URL gambar, di-set oleh service setelah upload
  meta_title?: string;
  meta_description?: string;
  keywords?: string;

  // PDF (opsional)
  pdf_file_id?: string;
  pdf_url?: string;
  pdf_filename?: string;
  pdf_mime?: string;
  pdf_size?: number;
  pdf_uploaded_at?: Date;
}

export interface UpdateMegazineData {
  title?: string;
  slug?: string;
  description?: string;
  megazine_isi?: string;
  image?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;

  // PDF (opsional, bisa di-clear dengan null)
  pdf_file_id?: string | null;
  pdf_url?: string | null;
  pdf_filename?: string | null;
  pdf_mime?: string | null;
  pdf_size?: number | null;
  pdf_uploaded_at?: Date | null;
}

// --- Repository Class ---

export class MegazineRepository {
  private slugGenerator: SlugGenerator = UtilityFactory.getSlugGenerator();
  private seoGenerator: SEOMetaGenerator = UtilityFactory.getSEOGenerator();

  // Daftar field yang aman untuk di-sort
  private readonly sortableFields = new Set<keyof Megazine | string>([
    "id",
    "title",
    "slug",
    "created_at",
    "updated_at",
  ]);

  /**
   * Membuat record Megazine baru.
   * - Slug dan meta SEO akan digenerate otomatis jika tidak disediakan.
   */
  async createByAdmin(dataMegazine: CreateMegazineData): Promise<Megazine> {
    try {
      const slug = await this.slugGenerator.generateUniqueSlug(
        dataMegazine.title,
        "megazine" // Nama tabel untuk memastikan keunikan
      );

      // Gunakan 'title' dan 'description' untuk generate SEO meta
      const seoMeta = this.seoGenerator.generateSEOMeta(
        dataMegazine.title,
        dataMegazine.description // 'description' lebih cocok untuk meta daripada 'megazine_isi'
      );

      const newMegazine = await prisma.megazine.create({
        data: {
          ...dataMegazine,
          slug,
          meta_title: dataMegazine.meta_title ?? seoMeta.metaTitle,
          meta_description:
            dataMegazine.meta_description ?? seoMeta.metaDescription,
        },
      });
      return newMegazine;
    } catch (error) {
      throw new Error(
        `Failed to create Megazine: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Memperbarui Megazine berdasarkan ID.
   * - Jika 'title' berubah, slug akan digenerate ulang.
   * - Jika 'title' atau 'description' berubah & meta kosong, SEO meta akan digenerate ulang.
   */
  async updateById(
    id: string,
    dataMegazine: UpdateMegazineData
  ): Promise<Megazine> {
    try {
      let updateData: UpdateMegazineData = { ...dataMegazine };

      // Generate ulang slug jika title berubah
      if (dataMegazine.title) {
        updateData.slug = await this.slugGenerator.generateUniqueSlug(
          dataMegazine.title,
          "megazine",
          id // Exclude ID saat ini dari pengecekan unik
        );
      }

      // Generate ulang SEO meta jika title/description berubah dan meta tidak diisi manual
      if (dataMegazine.title || dataMegazine.description) {
        const current = await prisma.megazine.findUnique({ where: { id } });
        if (current) {
          const title = dataMegazine.title ?? current.title;
          const description = dataMegazine.description ?? current.description;
          const seoMeta = this.seoGenerator.generateSEOMeta(title, description);

          if (typeof dataMegazine.meta_title === "undefined") {
            updateData.meta_title = seoMeta.metaTitle;
          }
          if (typeof dataMegazine.meta_description === "undefined") {
            updateData.meta_description = seoMeta.metaDescription;
          }
        }
      }

      const updated = await prisma.megazine.update({
        where: { id },
        data: updateData,
      });

      return updated;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025" // "Record to update not found."
      ) {
        throw new Error("Megazine not found");
      }
      throw new Error(
        `Failed to update Megazine: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Menghapus Megazine berdasarkan ID.
   */
  async deleteById(id: string): Promise<Megazine> {
    try {
      const deleted = await prisma.megazine.delete({ where: { id } });
      return deleted;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025" // "Record to delete does not exist."
      ) {
        throw new Error("Megazine not found");
      }
      throw new Error(
        `Failed to delete Megazine: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Mendapatkan semua Megazines dengan paginasi dan sorting.
   */
  async getAll(
    paginationParams: PaginationParams = {}
  ): Promise<PaginatedResult<Megazine>> {
    const page = Math.max(1, paginationParams.page ?? 1);
    const limit = Math.min(100, Math.max(1, paginationParams.limit ?? 10));
    const skip = (page - 1) * limit;

    const sortByRaw = paginationParams.sortBy ?? "created_at";
    const sortBy = this.sortableFields.has(sortByRaw)
      ? (sortByRaw as keyof Megazine)
      : "created_at";
    const sortOrder = paginationParams.sortOrder ?? "desc";

    const [data, total] = await Promise.all([
      prisma.megazine.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder } as any,
      }),
      prisma.megazine.count(),
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
  }

  /**
   * Mendapatkan satu Megazine berdasarkan slug-nya.
   */
  async findBySlug(slug: string): Promise<Megazine | null> {
    return prisma.megazine.findUnique({
      where: { slug },
    });
  }
}
