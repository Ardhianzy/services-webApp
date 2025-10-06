import bcrypt from "bcryptjs";
import { AdminAuthRepo } from "./auth_repo";
import { Admin } from "@prisma/client";
import imagekit from "../libs/imageKit";
import jwt from "jsonwebtoken";
import path from "path";

type SafeAdmin = Omit<Admin, "password">;

export class AdminAuthService {
  private repo: AdminAuthRepo;

  constructor() {
    this.repo = new AdminAuthRepo();
  }

  // Register Admin
  async register(adminData: {
    image?: Express.Multer.File;
    first_name: string;
    last_name: string;
    username: string;
    password: string;
  }): Promise<Admin> {
    if (!adminData.username?.trim()) throw new Error("Username is required");
    if (!adminData.password || adminData.password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    let imageUrl: string | null = null;

    if (adminData.image) {
      try {
        const fileBase64 = adminData.image.buffer.toString("base64");
        const response = await imagekit.upload({
          fileName: Date.now() + path.extname(adminData.image.originalname),
          file: fileBase64, // SDK ImageKit Node: base64 string OK
          folder: "Ardianzy/admins",
        });
        imageUrl = response.url;
      } catch {
        throw new Error("Failed to upload image");
      }
    }

    return this.repo.register({
      image: imageUrl,
      first_name: adminData.first_name,
      last_name: adminData.last_name,
      username: adminData.username,
      password: adminData.password,
    });
  }

  // Login Admin
  async login(
    username: string,
    password: string
  ): Promise<{ admin: SafeAdmin; token: string }> {
    if (!username?.trim() || !password?.trim()) {
      throw new Error("Username and password are required");
    }

    const admin = await this.repo.findByUsername(username);
    if (!admin) throw new Error("Invalid credentials");

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) throw new Error("Invalid credentials");

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET is not configured");

    const token = jwt.sign(
      {
        admin_Id: admin.id, // now string (cuid)
        username: admin.username,
      },
      jwtSecret,
      { expiresIn: "24h" }
    );

    const { password: _pw, ...adminWithoutPassword } = admin;
    return { admin: adminWithoutPassword, token };
  }

  // Change password
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<Admin> {
    if (!id?.trim()) throw new Error("Valid admin ID is required");
    if (!currentPassword || !newPassword) {
      throw new Error("Current and new passwords are required");
    }
    if (newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters");
    }
    if (currentPassword === newPassword) {
      throw new Error("New password must be different from current password");
    }

    return this.repo.changePassword(id, currentPassword, newPassword);
  }

  /**
   * Mendapatkan profil admin tanpa password
   */
  async getAdminProfile(admin_Id: string): Promise<SafeAdmin | null> {
    if (!admin_Id?.trim()) throw new Error("Valid admin ID is required");
    return this.repo.getAdminProfile(admin_Id);
  }

  /**
   * Update admin profile (tidak termasuk password)
   */
  async updateProfile(
    id: string,
    updateData: {
      first_name?: string;
      last_name?: string;
      username?: string;
    },
    imageFile?: Express.Multer.File
  ): Promise<Admin> {
    if (!id?.trim()) throw new Error("Valid admin ID is required");

    let imageUrl: string | undefined;
    if (imageFile) {
      try {
        const fileBase64 = imageFile.buffer.toString("base64");
        const response = await imagekit.upload({
          fileName: Date.now() + path.extname(imageFile.originalname),
          file: fileBase64,
          folder: "Ardianzy/admins",
        });
        imageUrl = response.url;
      } catch {
        throw new Error("Failed to upload image");
      }
    }

    return this.repo.updateAdmin(id, {
      ...updateData,
      ...(imageUrl && { image: imageUrl }),
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { admin_Id: string; username: string } {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET is not configured");

    try {
      const decoded = jwt.verify(token, jwtSecret) as {
        admin_Id: string;
        username: string;
      };
      return decoded;
    } catch {
      throw new Error("Invalid or expired token");
    }
  }
}
