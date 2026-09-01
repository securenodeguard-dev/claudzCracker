import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { Admin } from './schemas/admin.schema';

describe('AuthService', () => {
  let service: AuthService;
  let adminModel: any;

  const mockAdmin = {
    _id: 'abc123',
    email: 'admin@example.com',
    passwordHash: '',
    role: 'admin',
    isActive: true,
  };

  beforeEach(async () => {
    mockAdmin.passwordHash = await bcrypt.hash('correct-password', 4);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(Admin.name),
          useValue: {
            findOne: jest.fn().mockReturnValue({
              select: jest.fn().mockResolvedValue(mockAdmin),
            }),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('signed.jwt.token') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    adminModel = module.get(getModelToken(Admin.name));
  });

  it('returns an access token for correct credentials', async () => {
    const result = await service.login({ email: 'admin@example.com', password: 'correct-password' });
    expect(result.accessToken).toBe('signed.jwt.token');
    expect(result.admin.email).toBe('admin@example.com');
  });

  it('throws UnauthorizedException for wrong password', async () => {
    await expect(
      service.login({ email: 'admin@example.com', password: 'wrong-password' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when admin does not exist', async () => {
    adminModel.findOne.mockReturnValueOnce({ select: jest.fn().mockResolvedValue(null) });
    await expect(
      service.login({ email: 'nobody@example.com', password: 'whatever1' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when admin is inactive', async () => {
    adminModel.findOne.mockReturnValueOnce({
      select: jest.fn().mockResolvedValue({ ...mockAdmin, isActive: false }),
    });
    await expect(
      service.login({ email: 'admin@example.com', password: 'correct-password' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
