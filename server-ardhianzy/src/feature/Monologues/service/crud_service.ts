import prisma from "../../../config/db";
import { MonologuesRepository } from "../repository/MonologuesRepository"; // Ganti dengan path repository Anda
import { Monologues } from "@prisma/client";
import imagekit from "../../../libs/imageKit";
import path from "path";

// ===== Utilitas PDF (bisa dipindahkan ke file util terpisah) =====
function looksLikePdf(buf: Buffer): boolean {
  return buf.slice(0, 4).toString() === "%PDF";
}
const MAX_10MB = 10 * 1024 * 1024;

// ===== DTO untuk Service Layer =====
export interface CreateMonologueData {
  title: string;
  dialog: string;
  judul: string;
  meta_title?: string;
  meta_description?: string;
  is_published?: boolean;
  admin_id: string; // cuid
}

export interface UpdateMonologueData {
  title?: string;
  dialog?: string;
  judul?: string;
  meta_title?: string;
  meta_description?: string;
  is_published?: boolean;

  // Kontrol untuk PDF
  remove_pdf?: boolean; // Jika true, hapus PDF yang ada tanpa upload baru
}

export class MonologuesService {
  private repo: MonologuesRepository;

  constructor() {
    this.repo = new MonologuesRepository();
  }

  /**
   * Membuat Monologue baru.
   * Gambar dan PDF bersifat opsional.
   */
  async createByAdmin(
    body: CreateMonologueData,
    imageFile?: Express.Multer.File,
    pdfFile?: Express.Multer.File
  ): Promise<Monologues> {
    // Validasi dasar
    if (!body.title?.trim()) throw new Error("Title is required");
    if (!body.dialog?.trim()) throw new Error("Dialog is required");
    if (!body.judul?.trim()) throw new Error("Judul is required");
    if (!body.admin_id?.trim()) throw new Error("Admin ID is required");

    // ===== Upload IMAGE (Opsional) =====
    let imageUrl: string | undefined;
    if (imageFile) {
      try {
        const fileBase64 = imageFile.buffer.toString("base64");
        const response = await imagekit.upload({
          fileName: Date.now() + path.extname(imageFile.originalname),
          file: fileBase64,
          folder: "/website-ardhianzy/monologues/images", // Folder spesifik
          useUniqueFileName: true,
          tags: ["monologue", "image"], // Tag spesifik
        });
        imageUrl = response.url;
      } catch {
        throw new Error("Failed to upload image");
      }
    }

    // ===== Upload PDF (Opsional) =====
    let pdfPayload:
      | {
          pdf_file_id: string;
          pdf_url: string;
          pdf_filename: string;
          pdf_mime: string;
          pdf_size: number;
          pdf_uploaded_at: Date;
        }
      | undefined;

    if (pdfFile) {
      if (pdfFile.size > MAX_10MB)
        throw new Error("PDF file size cannot exceed 10MB");
      if (!looksLikePdf(pdfFile.buffer))
        throw new Error("The uploaded file is not a valid PDF");

      const safeName = body.title
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")
        .slice(0, 80);

      const uploaded = await imagekit.upload({
        file: pdfFile.buffer,
        fileName: `${safeName}.pdf`,
        folder: "/website-ardhianzy/monologues/pdfs", // Folder spesifik
        useUniqueFileName: true,
        isPrivateFile: false,
        tags: ["monologue", "pdf"], // Tag spesifik
      });

      pdfPayload = {
        pdf_file_id: uploaded.fileId,
        pdf_url: uploaded.url,
        pdf_filename: pdfFile.originalname,
        pdf_mime: pdfFile.mimetype || "application/pdf",
        pdf_size: pdfFile.size,
        pdf_uploaded_at: new Date(),
      };
    }

    // ===== Simpan ke database via repository =====
    return this.repo.createByAdmin({
      admin_id: body.admin_id,
      title: body.title,
      dialog: body.dialog,
      judul: body.judul,
      image: imageUrl,
      meta_title: body.meta_title,
      meta_description: body.meta_description,
      is_published: body.is_published,
      ...(pdfPayload ?? {}), // Sebarkan payload PDF jika ada
    });
  }

  /**
   * Memperbarui Monologue berdasarkan ID.
   * - Jika `remove_pdf` true, hapus PDF lama.
   * - Jika `pdfFile` ada, ganti PDF lama dengan yang baru.
   */
  async updateById(
    id: string,
    body: UpdateMonologueData,
    imageFile?: Express.Multer.File,
    pdfFile?: Express.Multer.File
  ): Promise<Monologues> {
    if (!id?.trim()) throw new Error("A valid Monologue ID is required");

    const existing = await prisma.monologues.findUnique({ where: { id } });
    if (!existing) throw new Error("Monologue not found");

    const updateData: any = {};

    // Map field biasa dari body ke updateData
    if (body.title?.trim()) updateData.title = body.title.trim();
    if (body.dialog?.trim()) updateData.dialog = body.dialog.trim();
    if (body.judul?.trim()) updateData.judul = body.judul.trim();
    if (body.meta_title?.trim()) updateData.meta_title = body.meta_title.trim();
    if (body.meta_description?.trim())
      updateData.meta_description = body.meta_description.trim();
    if (typeof body.is_published !== "undefined")
      updateData.is_published = body.is_published;

    // Ganti IMAGE (jika ada file baru)
    if (imageFile) {
      try {
        const fileBase64 = imageFile.buffer.toString("base64");
        const response = await imagekit.upload({
          fileName: Date.now() + path.extname(imageFile.originalname),
          file: fileBase64,
          folder: "/website-ardhianzy/monologues/images",
          useUniqueFileName: true,
          tags: ["monologue", "image"],
        });
        updateData.image = response.url;
      } catch {
        throw new Error("Failed to upload new image");
      }
    }

    // Hapus PDF tanpa mengupload yang baru
    if (body.remove_pdf === true && existing.pdf_file_id) {
      try {
        await imagekit.deleteFile(existing.pdf_file_id);
      } catch (err) {
        console.error(
          "Failed to delete old PDF from ImageKit, but proceeding:",
          err
        );
      }
      updateData.pdf_file_id = null;
      updateData.pdf_url = null;
      updateData.pdf_filename = null;
      updateData.pdf_mime = null;
      updateData.pdf_size = null;
      updateData.pdf_uploaded_at = null;
    }

    // Ganti PDF dengan mengupload yang baru
    if (pdfFile) {
      if (pdfFile.size > MAX_10MB)
        throw new Error("PDF file size cannot exceed 10MB");
      if (!looksLikePdf(pdfFile.buffer))
        throw new Error("The uploaded file is not a valid PDF");

      // Hapus PDF lama di ImageKit sebelum upload yang baru
      if (existing.pdf_file_id) {
        try {
          await imagekit.deleteFile(existing.pdf_file_id);
        } catch (err) {
          console.error(
            "Failed to delete old PDF from ImageKit, but proceeding:",
            err
          );
        }
      }

      const safeName = (body.title ?? existing.title)
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")
        .slice(0, 80);

      const uploaded = await imagekit.upload({
        file: pdfFile.buffer,
        fileName: `${safeName}.pdf`,
        folder: "/website-ardhianzy/monologues/pdfs",
        useUniqueFileName: true,
        isPrivateFile: false,
        tags: ["monologue", "pdf"],
      });

      updateData.pdf_file_id = uploaded.fileId;
      updateData.pdf_url = uploaded.url;
      updateData.pdf_filename = pdfFile.originalname;
      updateData.pdf_mime = pdfFile.mimetype || "application/pdf";
      updateData.pdf_size = pdfFile.size;
      updateData.pdf_uploaded_at = new Date();
    }

    // Panggil repository untuk update. Repository akan menangani slug & SEO meta.
    return this.repo.updateById(id, updateData);
  }

  /**
   * Menghapus Monologue berdasarkan ID.
   * File PDF terkait di ImageKit juga akan dihapus.
   */
  async deleteById(id: string): Promise<Monologues> {
    if (!id?.trim()) throw new Error("A valid Monologue ID is required");
    const existing = await prisma.monologues.findUnique({ where: { id } });
    if (!existing) throw new Error("Monologue not found");

    if (existing.pdf_file_id) {
      try {
        await imagekit.deleteFile(existing.pdf_file_id);
      } catch (err) {
        console.error(
          "Failed to delete PDF from ImageKit, but proceeding with DB deletion:",
          err
        );
      }
    }

    return this.repo.deleteById(id);
  }

  // ===== Metode Passthrough (hanya meneruskan ke Repository) =====

  async getAll(paginationParams?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{
    data: Monologues[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }> {
    return this.repo.getAll(paginationParams || {});
  }

  async findBySlug(slug: string): Promise<Monologues> {
    if (!slug?.trim()) throw new Error("Slug is required");
    const monologue = await this.repo.findBySlug(slug.trim());
    if (!monologue) throw new Error("Monologue not found");
    return monologue;
  }
  
  async getById(id: string): Promise<Monologues | null> {
    return prisma.monologues.findUnique({ where: { id } });
  }
}
