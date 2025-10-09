// src/feature/research/handler/crud_res.ts
import { Request, Response } from "express";
import { ResearchService } from "../service/crud_res";

// Perluas tipe Request agar nyaman akses files
declare global {
  namespace Express {
    interface Request {
      user?: {
        admin_Id: string; // dari middleware auth
        username: string;
      };
      file?: Express.Multer.File; // jika pakai .single()
      filed?: {
        [fieldname: string]: Express.Multer.File[];
      };
    }
  }
}

function getImageFromReq(req: Request): Express.Multer.File | undefined {
  // support: fields({ image }), single("image"), atau custom attach ke req.fileImage
  return (req.filed as any)?.image?.[0] || (req as any).fileImage || undefined;
}

function getPdfFromReq(req: Request): Express.Multer.File | undefined {
  // support: fields({ pdf }), uploadPdf.single("pdf")
  return (req.filed as any)?.pdf?.[0] || req.file || undefined;
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

      const imageFile = getImageFromReq(req);
      const pdfFile = getPdfFromReq(req);

      const created = await this.researchService.createByAdmin(
        {
          admin_id: adminId, // cuid string
          research_title: req.body.research_title,
          research_sum: req.body.research_sum,
          researcher: req.body.researcher,
          research_date: new Date(req.body.research_date),
          fiel: req.body.fiel, // ← WAJIB sesuai schema
          meta_title: req.body.meta_title,
          meta_description: req.body.meta_description,
          keywords: req.body.keywords,
          is_published:
            req.body.is_published === "true" || req.body.is_published === true,
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

      const imageFile = getImageFromReq(req);
      const pdfFile = getPdfFromReq(req);

      const updated = await this.researchService.updateById(
        id,
        {
          research_title: req.body.research_title,
          research_sum: req.body.research_sum,
          researcher: req.body.researcher,
          research_date: req.body.research_date
            ? new Date(req.body.research_date)
            : undefined,
          fiel: req.body.fiel,
          meta_title: req.body.meta_title,
          meta_description: req.body.meta_description,
          keywords: req.body.keywords,
          is_published:
            typeof req.body.is_published === "undefined"
              ? undefined
              : req.body.is_published === "true" ||
                req.body.is_published === true,
          // hapus PDF tanpa upload baru
          remove_pdf:
            req.body.remove_pdf === "true" || req.body.remove_pdf === true,
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
