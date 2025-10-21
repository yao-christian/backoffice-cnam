export interface UploadedFile {
  buffer: Uint8Array;
  name: string;
  mimetype: string;
  size: number;
}

export interface UpdateFileMetatDataRepository {
  (data: { id: number; fileName: string; fileUrl: string }): Promise<void>;
}
