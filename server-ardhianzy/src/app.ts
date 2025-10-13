import express, { Application, Request, Response, NextFunction } from "express";
import cors, { CorsOptions } from "cors";
import prisma from "./config/db";
import mainRoutes from "./routes";

const app: Application = express();

const allowedOrigins: string[] = [
  "https://www.ardhianzy.com",
  "https://ardhianzy.com",
  "http://localhost:5173",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRoutes);

import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({ message: "Akses ditolak oleh kebijakan CORS." });
  } else {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

app.use(errorHandler);

app.get("/test-db", async (_req: Request, res: Response) => {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, result });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Unknown error occurred" });
    }
  }
});

app.get("/", (_req: Request, res: Response) => {
  res.send("LISTEN AND SERVE YOUR BROWSER");
});

export default app;
