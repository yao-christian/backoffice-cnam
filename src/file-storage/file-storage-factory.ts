import { env } from "@/lib/env";
import { IFileStorageService } from "./file-storage.interface";
// import { VercelFileStorageService } from "./services/vercel-file-storage.service";
import { LocalFileStorageService } from "./services/local-file-storage.service";

export class FileStorageFactory {
  static createFileStorageService(): IFileStorageService {
    const storageType = env.STORAGE_TYPE || "local";

    switch (storageType) {
      case "vercel":
      // return new VercelFileStorageService();
      case "local":
      default:
        return new LocalFileStorageService();
    }
  }
}
