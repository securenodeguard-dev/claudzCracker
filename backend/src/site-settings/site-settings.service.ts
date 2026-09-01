import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SiteSettings, SiteSettingsDocument } from './schemas/site-settings.schema';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectModel(SiteSettings.name) private settingsModel: Model<SiteSettingsDocument>,
  ) {}

  // Site settings is a singleton document — there is only ever one row.
  // get() creates it with defaults on first access so the app never 404s.
  async get(): Promise<SiteSettingsDocument> {
    let settings = await this.settingsModel.findOne();
    if (!settings) {
      settings = await this.settingsModel.create({});
    }
    return settings;
  }

  async update(dto: UpdateSiteSettingsDto) {
    const settings = await this.get();
    Object.assign(settings, dto);
    return settings.save();
  }
}
