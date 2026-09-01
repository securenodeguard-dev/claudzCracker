import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { STORAGE_PROVIDER, StorageProvider, UploadResult } from './storage.provider';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB, per spec

@Injectable()
export class UploadsService {
  constructor(@Inject(STORAGE_PROVIDER) private storage: StorageProvider) {}

  validateFile(file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Only jpg, jpeg, png and webp images are allowed');
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new BadRequestException('Image must be 5 MB or smaller');
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<UploadResult> {
    this.validateFile(file);
    return this.storage.upload(file);
  }

  async removeImage(publicId: string): Promise<void> {
    return this.storage.remove(publicId);
  }
}
