import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SiteSettingsDocument = SiteSettings & Document;

@Schema({ timestamps: true, collection: 'site_settings' })
export class SiteSettings {
  @Prop({ required: true, default: 'Cracker Shop' })
  businessName: string;

  @Prop({ default: '' })
  tagline: string;

  @Prop({ default: '' })
  logoUrl: string;

  @Prop({ default: '' })
  phone: string;

  @Prop({ default: '' })
  whatsapp: string;

  @Prop({ default: '' })
  email: string;

  @Prop({ default: '' })
  address: string;

  @Prop({ default: '' })
  googleMapsUrl: string;

  @Prop({ default: '' })
  openingHours: string;

  @Prop({
    type: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    default: {},
  })
  socialLinks: { facebook: string; instagram: string; youtube: string };
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
