export interface IFileStorageService {
  uploadFile: (file: Uint8Array, filename: string) => Promise<string>;
  deleteFile: (filePath: string) => Promise<void>;
}
