/*import { put, del } from "@vercel/blob";
import { IFileStorageService } from "../file-storage.interface";

export class VercelFileStorageService implements IFileStorageService {
  async uploadFile(file: Uint8Array, filename: string): Promise<string> {
    const { url } = await put(`${process.env.UPLOAD_DIR}/${filename}`, file, {
      access: "public",
    });
    return url;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    await del(fileUrl);
  }
}*/
