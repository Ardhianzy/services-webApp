// src/feature/research/handler/crud_res.ts
import { Request, Response } from "express";
import { ResearchService } from "../service/crud_res";

// Perluas tipe Request agar nyaman akses files
declare global {
  namespace Express {
    interface Request {
      user?: {
        admin_Id: string; // dari middleware auth (perhatikan kapitalisasi konsisten dengan middleware)
        username: string;
      };
      file?: Express.Multer.File; // jika route pakai .single()
      files?:
        | Express.Multer.File[]
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;
      fileImage?: Express.Multer.File | undefined; // opsional jika kamu isi manual di middleware
    }
  }
}

/** Ambil file "image" dari req (mendukung .fields, custom, dsb.) */
function getImageFromReq(req: Request): Express.Multer.File | undefined {
  const anyReq = req as any;
  // Jika pakai .fields()
  const filesObj = (req.files as { [k: string]: Express.Multer.File[] }) || {};
  if (filesObj.image?.[0]) return filesObj.image[0];

  // Kalau ada custom attach
  if (anyReq.fileImage) return anyReq.fileImage;

  // Jika route lain pakai .single("image")
  if ((req as any).file && (req as any).file.fieldname === "image") {
    return (req as any).file as Express.Multer.File;
  }
  return undefined;
}

/** Ambil file "pdf" dari req (mendukung .fields atau .single("pdf")) */
function getPdfFromReq(req: Request): Express.Multer.File | undefined {
  const filesObj = (req.files as { [k: string]: Express.Multer.File[] }) || {};
  if (filesObj.pdf?.[0]) return filesObj.pdf[0];

  // fallback: .single("pdf")
  if ((req as any).file && (req as any).file.fieldname === "pdf") {
    return (req as any).file as Express.Multer.File;
  }
  return undefined;
}

/** Parse boolean dari multipart form-data */
function parseBool(v: unknown): boolean | undefined {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") {
    if (v.toLowerCase() === "true") return true;
    if (v.toLowerCase() === "false") return false;
  }
  return undefined;
}

/** Parse date ISO; balikan Date atau undefined */
function parseDate(v: unknown): Date | undefined {
  if (!v) return undefined;
  const d = new Date(String(v));
  return isNaN(d.getTime()) ? undefined : d;
}

export class ResearchHandler {
  private researchService: ResearchService;

  constructor() {
    this.researchService = new ResearchService();
  }

  // Create Research (Admin only)
  createByAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = req.user?.admin_Id;
      if (!adminId?.trim()) {
        res
          .status(401)
          .json({ success: false, message: "Authentication required" });
        return;
      }

      const imageFile = getImageFromReq(req); // file cover (opsional)
      const pdfFile = getPdfFromReq(req); // file PDF (opsional)

      const created = await this.researchService.createByAdmin(
        {
          admin_id: adminId, // cuid string
          research_title: req.body.research_title,
          research_sum: req.body.research_sum,
          researcher: req.body.researcher,
          research_date: parseDate(req.body.research_date) as Date, // CREATE: wajib sesuai schema
          fiel: req.body.fiel, // wajib sesuai schema (typo "fiel" di prisma)
          meta_title: req.body.meta_title,
          meta_description: req.body.meta_description,
          keywords: req.body.keywords,
          is_published: parseBool(req.body.is_published) ?? false,
          // NOTE: jika image kamu kirim sebagai URL (teks), ambil dari req.body.image di service
          // jika image file, service ambil dari imageFile (unggah ke ImageKit dan set URL cover).
        },
        imageFile,
        pdfFile
      );

      res.status(201).json({
        success: true,
        message: "Research created successfully",
        data: created,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create Research",
      });
    }
  };

  // Update Research by ID (Admin only)
  updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id?.trim();
      if (!id) {
        res.status(400).json({ success: false, message: "Invalid ID format" });
        return;
      }

      const imageFile = getImageFromReq(req); // opsional
      const pdfFile = getPdfFromReq(req); // opsional

      const updated = await this.researchService.updateById(
        id,
        {
          research_title: req.body.research_title,
          research_sum: req.body.research_sum,
          researcher: req.body.researcher,
          research_date: parseDate(req.body.research_date),
          fiel: req.body.fiel,
          meta_title: req.body.meta_title,
          meta_description: req.body.meta_description,
          keywords: req.body.keywords,
          is_published: parseBool(req.body.is_published),
          remove_pdf: parseBool(req.body.remove_pdf) === true, // hapus PDF tanpa upload baru
          // NOTE: image URL teks masih bisa dikirim via req.body.image jika bukan file.
        },
        imageFile,
        pdfFile
      );

      res.status(200).json({
        success: true,
        message: "Research updated successfully",
        data: updated,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Research not found") {
        res.status(404).json({ success: false, message: "Research not found" });
        return;
      }
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update Research",
      });
    }
  };

  // Delete Research by ID (Admin only)
  deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id?.trim();
      if (!id) {
        res.status(400).json({ success: false, message: "Invalid ID format" });
        return;
      }

      const deleted = await this.researchService.deleteById(id);

      res.status(200).json({
        success: true,
        message: "Research deleted successfully",
        data: deleted,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Research not found") {
          res
            .status(404)
            .json({ success: false, message: "Research not found" });
          return;
        }
        if (
          error.message === "Cannot delete Research: it has related records"
        ) {
          res.status(400).json({
            success: false,
            message: "Cannot delete Research: it has related records",
          });
          return;
        }
      }
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to delete Research",
      });
    }
  };

  // Get all Research dengan pagination
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || undefined;
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

      const result = await this.researchService.getAll({
        page,
        limit,
        sortBy,
        sortOrder,
      });

      res.status(200).json({
        success: true,
        message: "Research retrieved successfully",
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch Research list",
      });
    }
  };

  // Get Research by research title
  getByResearchTitle = async (req: Request, res: Response): Promise<void> => {
    try {
      const researchTitle = req.params.researchTitle?.trim();
      if (!researchTitle) {
        res.status(400).json({
          success: false,
          message: "Research title parameter is required",
        });
        return;
      }

      const research = await this.researchService.getByResearchTitle(
        researchTitle
      );

      res.status(200).json({
        success: true,
        message: "Research retrieved successfully",
        data: research,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Research not found") {
        res.status(404).json({ success: false, message: "Research not found" });
        return;
      }
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch Research",
      });
    }
  };
}
