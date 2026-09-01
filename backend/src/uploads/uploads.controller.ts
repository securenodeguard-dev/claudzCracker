import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UploadsService, MAX_FILE_SIZE_BYTES } from './uploads.service';

@ApiTags('uploads (admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('image')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a product image (jpg/jpeg/png/webp, max 5MB)' })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: MAX_FILE_SIZE_BYTES } }))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.uploadsService.uploadImage(file);
    return { url: result.url, publicId: result.publicId };
  }
}
