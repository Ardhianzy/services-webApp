// File: src/feature/Megazine/service/MegazineService.ts

import prisma from "../../../config/db";
import { MegazineRepository } from "../repository/MegazineRepository.ts";
import { Megazine } from "@prisma/client";
import imagekit from "../../../libs/imageKit"; // Pastikan path ini benar
import path from "path";

// --- Utilitas ---
function looksLikePdf(buf: Buffer): boolean {
  return buf.slice(0, 4).toString() === "%PDF";
}
const MAX_20MB = 20 * 1024 * 1024;

// --- DTO untuk Service Layer ---

// Data yang dibutuhkan dari handler untuk membuat Megazine baru
export interface CreateMegazineServiceData {
  title: string;
  description: string;
  megazine_isi: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  admin_id: string; // Diisi oleh handler dari token
}

// Data yang dibutuhkan dari handler untuk update
export interface UpdateMegazineServiceData {
  title?: string;
  description?: string;
  megazine_isi?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;

  // Kontrol untuk PDF
  remove_pdf?: boolean; // Jika true, hapus PDF yang ada tanpa upload baru
}

// --- Service Class ---

export class MegazineService {
  private repo: MegazineRepository;

  constructor() {
    this.repo = new MegazineRepository();
  }

  /**
   * Membuat Megazine baru.
   * Gambar wajib diupload, PDF opsional.
   */
  async createByAdmin(
    body: CreateMegazineServiceData,
    imageFile: Express.Multer.File, // Gambar wajib
    pdfFile?: Express.Multer.File // PDF opsional
  ): Promise<Megazine> {
    // Validasi dasar
    if (!body.title?.trim()) throw new Error("Title is required");
    if (!body.description?.trim()) throw new Error("Description is required");
    if (!body.megazine_isi?.trim())
      throw new Error("Content (megazine_isi) is required");
    if (!body.admin_id?.trim()) throw new Error("Admin ID is required");
    if (!imageFile) throw new Error("Image file is required");

    // ===== Upload IMAGE (Wajib) =====
    let imageUrl: string;
    try {
      const response = await imagekit.upload({
        fileName: Date.now() + path.extname(imageFile.originalname),
        file: imageFile.buffer,
        folder: "/website-ardhianzy/megazines/images", // Folder spesifik
        useUniqueFileName: true,
        tags: ["megazine", "image"],
      });
      imageUrl = response.url;
    } catch (error) {
      throw new Error(
        `Failed to upload image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    // ===== Upload PDF (Opsional) =====
    let pdfPayload: any; // Gunakan 'any' untuk kemudahan spread operator
    if (pdfFile) {
      if (pdfFile.size > MAX_20MB)
        throw new Error("PDF file size cannot exceed 20MB");
      if (!looksLikePdf(pdfFile.buffer))
        throw new Error("The uploaded file is not a valid PDF");

      const safeName = body.title
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")
        .slice(0, 80);
      const uploaded = await imagekit.upload({
        file: pdfFile.buffer,
        fileName: `${safeName}.pdf`,
        folder: "/website-ardhianzy/megazines/pdfs", // Folder spesifik
        useUniqueFileName: true,
        tags: ["megazine", "pdf"],
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
      ...body,
      image: imageUrl, // Sertakan URL gambar yang sudah diupload
      ...(pdfPayload ?? {}), // Sebarkan payload PDF jika ada
    });
  }

  /**
   * Memperbarui Megazine berdasarkan ID.
   * - Jika `remove_pdf` true, hapus PDF lama.
   * - Jika `pdfFile` ada, ganti PDF lama dengan yang baru.
   */
  async updateById(
    id: string,
    body: UpdateMegazineServiceData,
    imageFile?: Express.Multer.File,
    pdfFile?: Express.Multer.File
  ): Promise<Megazine> {
    const existing = await prisma.megazine.findUnique({ where: { id } });
    if (!existing) throw new Error("Megazine not found");

    const updateData: any = { ...body };

    // Ganti IMAGE (jika ada file baru)
    if (imageFile) {
      try {
        const response = await imagekit.upload({
          fileName: Date.now() + path.extname(imageFile.originalname),
          file: imageFile.buffer,
          folder: "/website-ardhianzy/megazines/images",
          useUniqueFileName: true,
        });
        updateData.image = response.url;
      } catch (error) {
        throw new Error(
          `Failed to upload new image: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
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
    }

    // Ganti PDF dengan mengupload yang baru
    if (pdfFile) {
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
        folder: "/website-ardhianzy/megazines/pdfs",
        useUniqueFileName: true,
      });
      updateData.pdf_file_id = uploaded.fileId;
      updateData.pdf_url = uploaded.url;
    }

    // Hapus properti 'remove_pdf' agar tidak dikirim ke Prisma
    delete updateData.remove_pdf;

    return this.repo.updateById(id, updateData);
  }

  /**
   * Menghapus Megazine berdasarkan ID.
   * File PDF terkait di ImageKit juga akan dihapus.
   */
  async deleteById(id: string): Promise<Megazine> {
    const existing = await prisma.megazine.findUnique({ where: { id } });
    if (!existing) throw new Error("Megazine not found");

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

  async getAll(params: any) {
    return this.repo.getAll(params);
  }

  async findBySlug(slug: string): Promise<Megazine> {
    const megazine = await this.repo.findBySlug(slug);
    if (!megazine) throw new Error("Megazine not found");
    return megazine;
  }
}
