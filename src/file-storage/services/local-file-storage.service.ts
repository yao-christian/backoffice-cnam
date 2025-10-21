import * as fs from "fs";
import * as path from "path";
import { IFileStorageService } from "../file-storage.interface";
import { env } from "@/lib/env";

const baseUrl = env.NEXT_PUBLIC_BASE_URL;

export class LocalFileStorageService implements IFileStorageService {
  async uploadFile(file: Uint8Array, filename: string): Promise<string> {
    const uploadDir = process.env.UPLOAD_DIR!;
    await fs.promises.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, file);

    const fileUrl = new URL(
      path.join("api/uploads", filename),
      baseUrl,
    ).toString();

    return fileUrl;
  }

  async deleteFile(filePath: string): Promise<void> {
    await fs.promises.unlink(filePath);
  }
}
