import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { storageProviderFactory } from './storage.provider';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, storageProviderFactory],
  exports: [UploadsService],
})
export class UploadsModule {}
