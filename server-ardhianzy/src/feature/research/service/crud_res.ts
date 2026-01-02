import prisma from "../../../config/db";
import { ResearchRepository } from "../repository/crud_res";
import { Research } from "@prisma/client";
import imagekit from "../../../libs/imageKit";
import path from "path";

// ===== Util PDF =====
function looksLikePdf(buf: Buffer) {
  return buf.slice(0, 4).toString() === "%PDF";
}
const MAX_10MB = 10 * 1024 * 1024;

// ===== DTO untuk Service =====
export interface CreateResearchData {
  // files masuk via parameter terpisah biar Service tetap testable
  research_title: string;
  research_sum: string;
  researcher: string;
  research_date: Date;
  fiel: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  is_published?: boolean;
  admin_id: string; // cuid
}

export interface UpdateResearchData {
  research_title?: string;
  research_sum?: string;
  researcher?: string;
  research_date?: Date;
  fiel?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  is_published?: boolean;

  // kontrol PDF
  remove_pdf?: boolean; // true = hapus PDF tanpa upload baru
}

export class ResearchService {
  private repo: ResearchRepository;

  constructor() {
    this.repo = new ResearchRepository();
  }

  /**
   * Create Research (upload image wajib, pdf opsional).
   * imageFile & pdfFile didapat dari handler (multer)
   */
  async createByAdmin(
    body: CreateResearchData,
    imageFile?: Express.Multer.File,
    pdfFile?: Express.Multer.File
  ): Promise<Research> {
    // Validasi basic
    if (!body.research_title?.trim())
      throw new Error("Research title is required");
    if (!body.research_sum?.trim())
      throw new Error("Research summary is required");
    if (!body.researcher?.trim()) throw new Error("Researcher is required");
    if (!body.research_date) throw new Error("Research date is required");
    if (!body.fiel?.trim()) throw new Error("Field 'fiel' is required");
    if (!body.admin_id?.trim()) throw new Error("Admin ID is required");

    // ===== Upload IMAGE (wajib menurut service-mu sebelumnya)
    if (!imageFile) throw new Error("Image is required");
    let imageUrl: string;
    try {
      const fileBase64 = imageFile.buffer.toString("base64");
      const response = await imagekit.upload({
        fileName: Date.now() + path.extname(imageFile.originalname),
        file: fileBase64,
        folder: "/website-ardhianzy/research/images",
        useUniqueFileName: true,
        tags: ["research", "image"],
      });
      imageUrl = response.url;
    } catch {
      throw new Error("Failed to upload image");
    }

    // ===== Upload PDF (opsional)
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
      if (pdfFile.size > MAX_10MB) throw new Error("PDF > 10MB ditolak");
      if (!looksLikePdf(pdfFile.buffer))
        throw new Error("File bukan PDF valid");

      const safeName = body.research_title
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")
        .slice(0, 80);

      const uploaded = await imagekit.upload({
        file: pdfFile.buffer, // langsung buffer
        fileName: `${safeName}.pdf`,
        folder: "/website-ardhianzy/research/pdfs",
        useUniqueFileName: true,
        isPrivateFile: false,
        tags: ["research", "pdf"],
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

    // ===== Simpan via repo
    return this.repo.createByAdmin({
      admin_id: body.admin_id,
      research_title: body.research_title,
      research_sum: body.research_sum,
      image: imageUrl,
      researcher: body.researcher,
      research_date: body.research_date,
      fiel: body.fiel,
      meta_title: body.meta_title,
      meta_description: body.meta_description,
      keywords: body.keywords,
      is_published: body.is_published,
      ...(pdfPayload ?? {}),
    });
  }

  /**
   * Update Research (image & pdf opsional).
   * - Jika remove_pdf = true → hapus PDF lama (ImageKit + kolom DB)
   * - Jika pdfFile ada → replace PDF lama
   */
  async updateById(
    id: string,
    body: UpdateResearchData,
    imageFile?: Express.Multer.File,
    pdfFile?: Express.Multer.File
  ): Promise<Research> {
    if (!id?.trim()) throw new Error("Valid Research ID is required");

    // ambil existing buat operasi replace/hapus PDF
    const existing = await prisma.research.findUnique({ where: { id } });
    if (!existing) throw new Error("Research not found");

    const updateData: any = {};

    // fields biasa
    if (body.research_title?.trim())
      updateData.research_title = body.research_title.trim();
    if (body.research_sum?.trim())
      updateData.research_sum = body.research_sum.trim();
    if (body.researcher?.trim()) updateData.researcher = body.researcher.trim();
    if (typeof body.fiel !== "undefined") updateData.fiel = body.fiel;
    if (body.research_date) updateData.research_date = body.research_date;
    if (body.meta_title?.trim()) updateData.meta_title = body.meta_title.trim();
    if (body.meta_description?.trim())
      updateData.meta_description = body.meta_description.trim();
    if (body.keywords?.trim()) updateData.keywords = body.keywords.trim();
    if (typeof body.is_published !== "undefined")
      updateData.is_published = body.is_published;

    // replace IMAGE (opsional)
    if (imageFile) {
      try {
        const fileBase64 = imageFile.buffer.toString("base64");
        const response = await imagekit.upload({
          fileName: Date.now() + path.extname(imageFile.originalname),
          file: fileBase64,
          folder: "/website-ardhianzy/research/images",
          useUniqueFileName: true,
          tags: ["research", "image"],
        });
        updateData.image = response.url;
      } catch {
        throw new Error("Failed to upload image");
      }
    }

    // hapus PDF tanpa upload baru
    if (body.remove_pdf === true && existing.pdf_file_id) {
      try {
        await imagekit.deleteFile(existing.pdf_file_id);
      } catch {
        /* ignore */
      }
      updateData.pdf_file_id = null;
      updateData.pdf_url = null;
      updateData.pdf_filename = null;
      updateData.pdf_mime = null;
      updateData.pdf_size = null;
      updateData.pdf_uploaded_at = null;
    }

    // replace PDF (upload baru)
    if (pdfFile) {
      if (pdfFile.size > MAX_10MB) throw new Error("PDF > 10MB ditolak");
      if (!looksLikePdf(pdfFile.buffer))
        throw new Error("File bukan PDF valid");

      if (existing.pdf_file_id) {
        try {
          await imagekit.deleteFile(existing.pdf_file_id);
        } catch {
          /* ignore */
        }
      }

      const safeName = (body.research_title ?? existing.research_title)
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, "-")
        .slice(0, 80);

      const uploaded = await imagekit.upload({
        file: pdfFile.buffer,
        fileName: `${safeName}.pdf`,
        folder: "/website-ardhianzy/research/pdfs",
        useUniqueFileName: true,
        isPrivateFile: false,
        tags: ["research", "pdf"],
      });

      updateData.pdf_file_id = uploaded.fileId;
      updateData.pdf_url = uploaded.url;
      updateData.pdf_filename = pdfFile.originalname;
      updateData.pdf_mime = pdfFile.mimetype || "application/pdf";
      updateData.pdf_size = pdfFile.size;
      updateData.pdf_uploaded_at = new Date();
    }

    // repo akan:
    // - regenerate slug kalau title berubah
    // - regenerate SEO meta kalau title/summary berubah (jika meta tidak diisi)
    return this.repo.updateById(id, updateData);
  }

  async deleteById(id: string): Promise<Research> {
    if (!id?.trim()) throw new Error("Valid Research ID is required");
    const existing = await prisma.research.findUnique({ where: { id } });
    if (!existing) throw new Error("Research not found");

    if (existing.pdf_file_id) {
      try {
        await imagekit.deleteFile(existing.pdf_file_id);
      } catch {
        /* ignore */
      }
    }

    return this.repo.deleteById(id);
  }

  // passthrough list & getByTitle
  async getAll(paginationParams?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{
    data: Research[];
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

  async getByResearchTitle(researchTitle: string): Promise<Research> {
    if (!researchTitle?.trim()) throw new Error("Research title is required");
    const research = await this.repo.getByResearchTitle(researchTitle.trim());
    if (!research) throw new Error("Research not found");
    return research;
  }
  async getById(id: string): Promise<Research | null> {
    return prisma.research.findUnique({ where: { id } });
  }
}
