import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SiteSettingsService } from './site-settings.service';
import { UpdateSiteSettingsDto } from './dto/update-site-settings.dto';

@ApiTags('site-settings (public)')
@Controller('site-settings')
export class SiteSettingsPublicController {
  constructor(private settingsService: SiteSettingsService) {}

  @Get('public')
  @ApiOperation({ summary: 'Get public business/contact information' })
  getPublic() {
    return this.settingsService.get();
  }
}

@ApiTags('site-settings (admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/site-settings')
export class SiteSettingsAdminController {
  constructor(private settingsService: SiteSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get site settings (admin view)' })
  get() {
    return this.settingsService.get();
  }

  @Patch()
  @ApiOperation({ summary: 'Update site settings' })
  update(@Body() dto: UpdateSiteSettingsDto) {
    return this.settingsService.update(dto);
  }
}
