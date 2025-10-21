import { IFileStorageService } from "./file-storage.interface";
import { FileStorageFactory } from "./file-storage-factory";

export class FileStorageProxy implements IFileStorageService {
  private fileStorageService: IFileStorageService;

  constructor() {
    this.fileStorageService = FileStorageFactory.createFileStorageService();
  }

  uploadFile(file: Uint8Array, filename: string): Promise<string> {
    return this.fileStorageService.uploadFile(file, filename);
  }

  deleteFile(filePath: string): Promise<void> {
    return this.fileStorageService.deleteFile(filePath);
  }
}
