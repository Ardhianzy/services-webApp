import { Request, Response, NextFunction } from "express";
import { ArticleService } from "../service/crud_articel"; // Sesuaikan path
import { Article } from "@prisma/client";

// --- Deklarasi Global & Helper Functions ---
declare global {
  namespace Express {
    interface Request {
      user?: { admin_Id: string; username: string };
      file?: Express.Multer.File; 
    }
  }
}

/** Parse boolean dari string "true" atau "false" */
function parseBool(value: unknown): boolean | undefined {
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return undefined;
}

/** Parse date dari string dan validasi hasilnya */
function parseDate(value: unknown): Date | null {
  if (!value) return null;
  const d = new Date(String(value));
  return isNaN(d.getTime()) ? null : d;
}

// ===============================================

export class ArticleHandler {
  private articleService: ArticleService;

  constructor() {
    this.articleService = new ArticleService();
  }

  createByAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminId = req.user?.admin_Id;
      if (!adminId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const date = parseDate(req.body.date);
      if (!date) {
        res
          .status(400)
          .json({ success: false, message: "Valid date is required" });
        return;
      }

      // Validasi category enum


      const body = {
        admin_id: adminId,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        date: date,

        meta_title: req.body.meta_title,
        meta_description: req.body.meta_description,
        keywords: req.body.keywords,
        excerpt: req.body.excerpt,
        canonical_url: req.body.canonical_url,
        is_published: parseBool(req.body.is_published) ?? false,
        is_featured: parseBool(req.body.is_featured) ?? false,
      };

      const newArticle = await this.articleService.createByAdmin(
        body,
        req.file as Express.Multer.File
      );

      res.status(201).json({
        success: true,
        message: "Article created successfully",
        data: newArticle,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create Article",
      });
    }
  };

  updateById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id?.trim();
      if (!id) {
        res
          .status(400)
          .json({ success: false, message: "Article ID is required" });
        return;
      }

      const updateData: any = {};

      // Salin field yang ada dari body
      const fields = [
        "title",
        "content",
        "author",
        "meta_title",
        "meta_description",
        "keywords",
        "excerpt",
        "canonical_url",

        "view_count",
      ];
      fields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      // Handle parsing khusus
      if (req.body.date !== undefined)
        updateData.date = parseDate(req.body.date);
      if (req.body.is_published !== undefined)
        updateData.is_published = parseBool(req.body.is_published);
      if (req.body.is_featured !== undefined)
        updateData.is_featured = parseBool(req.body.is_featured);

      // 1. Fetch existing article
      const existingArticle = await this.articleService.getById(id);
      if (!existingArticle) {
        res.status(404).json({ success: false, message: "Article not found" });
        return;
      }

      // 2. Ownership Check
      const adminId = req.user?.admin_Id;
      // 2. Ownership Check (RELAXED)
      /*
      if (existingArticle.admin_id !== adminId) {
        res.status(403).json({
          success: false,
          message: "Forbidden: You are not the owner of this article",
        });
        return;
      }
      */

      const updatedArticle = await this.articleService.updateById(
        id,
        updateData,
        req.file
      );

      res.status(200).json({
        success: true,
        message: "Article updated successfully",
        data: updatedArticle,
      });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to update Article";
      res
        .status(msg === "Article not found" ? 404 : 500)
        .json({ success: false, message: msg });
    }
  };

  deleteById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id?.trim();
      if (!id) {
        res
          .status(400)
          .json({ success: false, message: "Article ID is required" });
        return;
      }
      // 1. Fetch existing article
      const existingArticle = await this.articleService.getById(id);
      if (!existingArticle) {
        res.status(404).json({ success: false, message: "Article not found" });
        return;
      }

      // 2. Ownership Check
      const adminId = req.user?.admin_Id;
      // 2. Ownership Check (RELAXED)
      /*
      if (existingArticle.admin_id !== adminId) {
        res.status(403).json({
          success: false,
          message: "Forbidden: You are not the owner of this article",
        });
        return;
      }
      */

      const deletedArticle = await this.articleService.deleteById(id);
      res.status(200).json({
        success: true,
        message: "Article deleted successfully",
        data: deletedArticle,
      });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to delete Article";
      res
        .status(msg === "Article not found" ? 404 : 500)
        .json({ success: false, message: msg });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.articleService.getAll({
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as keyof Article,
        sortOrder: req.query.sortOrder as "asc" | "desc",
      });
      res.status(200).json({
        success: true,
        message: "Articles retrieved successfully",
        ...result,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to fetch articles" });
    }
  };

  // Mengganti getByTitle dengan findBySlug untuk URL yang lebih baik
  findBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const slug = req.params.slug?.trim();
      if (!slug) {
        res.status(400).json({ success: false, message: "Slug is required" });
        return;
      }
      // Asumsi service memiliki method findBySlug
      const article = await (this.articleService as any).findBySlug(slug);
      res.status(200).json({
        success: true,
        message: "Article retrieved successfully",
        data: article,
      });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to fetch article";
      res
        .status(msg === "Article not found" ? 404 : 500)
        .json({ success: false, message: msg });
    }
  };
  getByTitle = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title } = req.params;
      if (!title) {
        res.status(400).json({
          success: false,
          message: "Title parameter is required",
        });
        return;
      }
      const article = await this.articleService.getByTitle(title);
      res.status(200).json({
        success: true,
        message: "Article retrieved successfully",
        data: article,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Article not found") {
        res.status(404).json({
          success: false,
          message: "Article not found",
        });
        return;
      }
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch Article",
      });
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      // Validation: If ID is not long enough (likely a slug or invalid), pass to next handler
      if (!id || id.length < 20) {
        return next();
      }

      const article = await this.articleService.getById(id);

      if (!article) {
        res.status(404).json({
          success: false,
          message: "Article not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Article retrieved successfully",
        data: article,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch Article",
      });
    }
  };
}
