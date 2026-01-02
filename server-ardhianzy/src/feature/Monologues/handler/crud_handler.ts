import { Request, Response } from "express";
import { MonologuesService } from "../service/crud_service"; // Sesuaikan path

// --- Deklarasi Global yang Lebih Fleksibel ---
declare global {
  namespace Express {
    interface UserAuthPayload {
      admin_Id: string;
      username: string;
    }
    interface Request {
      user?: UserAuthPayload;
      files?:
        | { [fieldname: string]: Express.Multer.File[] }
        | Express.Multer.File[];
    }
  }
}

function getImageFromReq(req: Request): Express.Multer.File | undefined {
  if (req.files && !Array.isArray(req.files)) {
    return req.files["image"]?.[0];
  }
  return undefined;
}
function getPdfFromReq(req: Request): Express.Multer.File | undefined {
  if (req.files && !Array.isArray(req.files)) {
    return req.files["pdf"]?.[0];
  }
  return undefined;
}
function parseBool(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return undefined;
}

// =========================================================

export class MonologuesHandler {
  private monologuesService: MonologuesService;

  constructor() {
    this.monologuesService = new MonologuesService();
  }

  createByAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = req.user?.admin_Id;
      if (!adminId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      // Gunakan helper functions untuk kebersihan kode
      const imageFile = getImageFromReq(req);
      const pdfFile = getPdfFromReq(req);

      const body = {
        title: req.body.title,
        dialog: req.body.dialog,
        judul: req.body.judul,
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        is_published: parseBool(req.body.is_published) ?? false, // Lebih aman
        admin_id: adminId,
      };

      const newMonologue = await this.monologuesService.createByAdmin(
        body,
        imageFile,
        pdfFile
      );

      res.status(201).json({
        success: true,
        message: "Monologue created successfully",
        data: newMonologue,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create Monologue",
      });
    }
  };

  updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id?.trim();
      if (!id) {
        res
          .status(400)
          .json({ success: false, message: "Monologue ID is required" });
        return;
      }

      const imageFile = getImageFromReq(req);
      const pdfFile = getPdfFromReq(req);
      
      const existing = await this.monologuesService.getById(id);
      if (!existing) {
        res.status(404).json({ success: false, message: "Monologue not found" });
        return;
      }
      if (existing.admin_id !== req.user?.admin_Id) {
        res.status(403).json({
          success: false,
          message: "Forbidden: You are not the owner of this monologue",
        });
        return;
      }

      // Eksplisit mendefinisikan data update, bukan menyalin semua dari body
      const updateData = {
        title: req.body.title,
        dialog: req.body.dialog,
        judul: req.body.judul,
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        is_published: parseBool(req.body.is_published),
        remove_pdf: parseBool(req.body.remove_pdf),
      };

      const updatedMonologue = await this.monologuesService.updateById(
        id,
        updateData,
        imageFile,
        pdfFile
      );

      res.status(200).json({
        success: true,
        message: "Monologue updated successfully",
        data: updatedMonologue,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update Monologue";
      const statusCode = errorMessage === "Monologue not found" ? 404 : 500;
      res.status(statusCode).json({ success: false, message: errorMessage });
    }
  };

  deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id?.trim();
      if (!id) {
        res
          .status(400)
          .json({ success: false, message: "Monologue ID is required" });
        return;
      }
      const existing = await this.monologuesService.getById(id);
      if (!existing) {
        res.status(404).json({ success: false, message: "Monologue not found" });
        return;
      }
      if (existing.admin_id !== req.user?.admin_Id) {
        res.status(403).json({
          success: false,
          message: "Forbidden: You are not the owner of this monologue",
        });
        return;
      }
      const deletedMonologue = await this.monologuesService.deleteById(id);

      res.status(200).json({
        success: true,
        message: "Monologue deleted successfully",
        data: deletedMonologue,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete Monologue";
      const statusCode = errorMessage === "Monologue not found" ? 404 : 500;
      res.status(statusCode).json({ success: false, message: errorMessage });
    }
  };

  // Method getAll dan findBySlug sudah sangat baik dan tidak perlu perubahan.
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || "created_at";
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";
      const result = await this.monologuesService.getAll({
        page,
        limit,
        sortBy,
        sortOrder,
      });
      res.status(200).json({
        success: true,
        message: "Monologues retrieved successfully",
        ...result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch list",
      });
    }
  };

  findBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
      const monologue = await this.monologuesService.findBySlug(slug);
      res.status(200).json({
        success: true,
        message: "Monologue retrieved successfully",
        data: monologue,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch Monologue";
      const statusCode = errorMessage === "Monologue not found" ? 404 : 500;
      res.status(statusCode).json({ success: false, message: errorMessage });
    }
  };
}
