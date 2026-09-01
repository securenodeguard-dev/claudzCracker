import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

export interface UploadResult {
  url: string;
  publicId: string;
}

export interface StorageProvider {
  upload(file: Express.Multer.File): Promise<UploadResult>;
  remove(publicId: string): Promise<void>;
}

// Uploads to Cloudinary. Used whenever real Cloudinary credentials are
// configured (any environment: local, QA, or production).
@Injectable()
class CloudinaryStorageProvider implements StorageProvider {
  private readonly logger = new Logger('CloudinaryStorage');

  constructor(configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.get<string>('cloudinary.cloudName'),
      api_key: configService.get<string>('cloudinary.apiKey'),
      api_secret: configService.get<string>('cloudinary.apiSecret'),
    });
  }

  async upload(file: Express.Multer.File): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'cracker-shop/products',
          resource_type: 'image',
          // Web-optimized delivery transformations
          transformation: [{ quality: 'auto', fetch_format: 'auto', width: 1200, crop: 'limit' }],
        },
        (error, result) => {
          if (error || !result) {
            this.logger.error('Cloudinary upload failed', error);
            return reject(error);
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );
      stream.end(file.buffer);
    });
  }

  async remove(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}

// Local-disk fallback so the critical vertical flow (and local dev) works
// with zero external accounts when Cloudinary env vars are left as
// placeholders. Swap to CloudinaryStorageProvider automatically once real
// credentials are set — see storage.provider.factory below.
@Injectable()
class LocalDiskStorageProvider implements StorageProvider {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor() {
    if (!existsSync(this.uploadDir)) mkdirSync(this.uploadDir, { recursive: true });
  }

  async upload(file: Express.Multer.File): Promise<UploadResult> {
    const ext = file.originalname.split('.').pop();
    const publicId = `${randomUUID()}`;
    const filename = `${publicId}.${ext}`;
    writeFileSync(join(this.uploadDir, filename), file.buffer);
    return { url: `/uploads/${filename}`, publicId: filename };
  }

  async remove(publicId: string): Promise<void> {
    const filePath = join(this.uploadDir, publicId);
    if (existsSync(filePath)) unlinkSync(filePath);
  }
}

export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';

export const storageProviderFactory = {
  provide: STORAGE_PROVIDER,
  useFactory: (configService: ConfigService): StorageProvider => {
    const cloudName = configService.get<string>('cloudinary.cloudName');
    const apiKey = configService.get<string>('cloudinary.apiKey');
    const apiSecret = configService.get<string>('cloudinary.apiSecret');
    const hasRealCloudinaryConfig =
      cloudName && apiKey && apiSecret && !['replace_me', ''].includes(cloudName);

    if (hasRealCloudinaryConfig) {
      return new CloudinaryStorageProvider(configService);
    }
    // eslint-disable-next-line no-console
    console.warn(
      '[uploads] Cloudinary credentials not configured — falling back to local-disk storage. ' +
        'Set CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET to use Cloudinary.',
    );
    return new LocalDiskStorageProvider();
  },
  inject: [ConfigService],
};
