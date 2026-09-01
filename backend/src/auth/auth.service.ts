import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const admin = await this.adminModel.findOne({ email: dto.email.toLowerCase() }).select('+passwordHash');

    // Same generic error for "not found" and "wrong password" — never reveal
    // which one it was, to avoid leaking valid admin emails.
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: admin._id.toString(), email: admin.email, role: admin.role };
    return {
      accessToken: this.jwtService.sign(payload),
      admin: { id: admin._id.toString(), name: admin.name, email: admin.email, role: admin.role },
    };
  }
}
