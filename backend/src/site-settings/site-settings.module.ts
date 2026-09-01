import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteSettings, SiteSettingsSchema } from './schemas/site-settings.schema';
import { SiteSettingsService } from './site-settings.service';
import {
  SiteSettingsPublicController,
  SiteSettingsAdminController,
} from './site-settings.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: SiteSettings.name, schema: SiteSettingsSchema }])],
  controllers: [SiteSettingsPublicController, SiteSettingsAdminController],
  providers: [SiteSettingsService],
})
export class SiteSettingsModule {}
