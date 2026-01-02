import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate =
  (schema: ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        file: req.file,
      })) as { body: any; query: any; params: any };

      req.body = result.body;
      req.query = result.query;
      req.params = result.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: (error as any).errors.map((e: any) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: "Internal server error during validation",
      });
      return;
    }
  };

