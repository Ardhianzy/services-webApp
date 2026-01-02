import { Request, Response } from "express";
import { MegazineService } from "../service/MegazineService"; // Pastikan path ini benar
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

// ===== HELPER FUNCTIONS (untuk kebersihan dan reusabilitas) =====

/** Ambil file "image" dari req, mendukung .fields() */
function getImageFromReq(req: Request): Express.Multer.File | undefined {
  if (req.files && !Array.isArray(req.files)) {
    return req.files["image"]?.[0];
  }
  return undefined;
}

/** Ambil file "pdf" dari req, mendukung .fields() */
function getPdfFromReq(req: Request): Express.Multer.File | undefined {
  if (req.files && !Array.isArray(req.files)) {
    return req.files["pdf"]?.[0];
  }
  return undefined;
}

/** Parse boolean dari string "true" atau "false" di form-data */
function parseBool(value: unknown): boolean | undefined {
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return undefined;
}

// =========================================================

export class MegazineHandler {
  private megazineService: MegazineService;

  constructor() {
    this.megazineService = new MegazineService();
  }

  createByAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = req.user?.admin_Id;
      if (!adminId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const imageFile = getImageFromReq(req);
      const pdfFile = getPdfFromReq(req);

      // Sesuai service, gambar wajib saat create
      if (!imageFile) {
        res
          .status(400)
          .json({ success: false, message: "Image file is required" });
        return;
      }

      const body = {
        title: req.body.title,
        description: req.body.description,
        megazine_isi: req.body.megazine_isi,
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        keywords: req.body.keywords,
        is_published: req.body.is_published,
        admin_id: adminId,
      };

      const newMegazine = await this.megazineService.createByAdmin(
        body,
        imageFile,
        pdfFile
      );

      res.status(201).json({
        success: true,
        message: "Megazine created successfully",
        data: newMegazine,
      });
    } catch (error) {
      console.error("GAGAL MEMBUAT MEGAZINE, DETAIL ERROR:", error);
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create Megazine",
      });
    }
  };

  updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id?.trim();
      if (!id) {
        res
          .status(400)
          .json({ success: false, message: "Megazine ID is required" });
        return;
      }

      const imageFile = getImageFromReq(req);
      const pdfFile = getPdfFromReq(req);
      
      const existing = await this.megazineService.getById(id);
      if (!existing) {
        res.status(404).json({ success: false, message: "Megazine not found" });
        return;
      }
      if (existing.admin_id !== req.user?.admin_Id) {
        res.status(403).json({
          success: false,
          message: "Forbidden: You are not the owner of this megazine",
        });
        return;
      }

      const updateData = {
        title: req.body.title,
        description: req.body.description,
        megazine_isi: req.body.megazine_isi,
        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        keywords: req.body.keywords,
        remove_pdf: parseBool(req.body.remove_pdf),
        is_published: parseBool(req.body.is_published),
      };

      const updatedMegazine = await this.megazineService.updateById(
        id,
        updateData,
        imageFile,
        pdfFile
      );

      res.status(200).json({
        success: true,
        message: "Megazine updated successfully",
        data: updatedMegazine,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update Megazine";
      const statusCode = errorMessage === "Megazine not found" ? 404 : 500;
      res.status(statusCode).json({ success: false, message: errorMessage });
    }
  };

  deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id?.trim();
      if (!id) {
        res
          .status(400)
          .json({ success: false, message: "Megazine ID is required" });
        return;
      }
      const existing = await this.megazineService.getById(id);
      if (!existing) {
        res.status(404).json({ success: false, message: "Megazine not found" });
        return;
      }
      if (existing.admin_id !== req.user?.admin_Id) {
        res.status(403).json({
          success: false,
          message: "Forbidden: You are not the owner of this megazine",
        });
        return;
      }
      const deletedMegazine = await this.megazineService.deleteById(id);

      res.status(200).json({
        success: true,
        message: "Megazine deleted successfully",
        data: deletedMegazine,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete Megazine";
      const statusCode = errorMessage === "Megazine not found" ? 404 : 500;
      res.status(statusCode).json({ success: false, message: errorMessage });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sortBy = (req.query.sortBy as string) || "created_at";
      const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";

      const result = await this.megazineService.getAll({
        page,
        limit,
        sortBy,
        sortOrder,
      });

      res.status(200).json({
        success: true,
        message: "Megazines retrieved successfully",
        ...result, // Sebarkan { data, pagination }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch Megazines list",
      });
    }
  };

  findBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
      const megazine = await this.megazineService.findBySlug(slug);

      res.status(200).json({
        success: true,
        message: "Megazine retrieved successfully",
        data: megazine,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch Megazine";
      const statusCode = errorMessage === "Megazine not found" ? 404 : 500;
      res.status(statusCode).json({ success: false, message: errorMessage });
    }
  };
}
