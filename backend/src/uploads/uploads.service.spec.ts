import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { STORAGE_PROVIDER } from './storage.provider';

describe('UploadsService', () => {
  let service: UploadsService;
  const mockStorage = { upload: jest.fn(), remove: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadsService, { provide: STORAGE_PROVIDER, useValue: mockStorage }],
    }).compile();
    service = module.get<UploadsService>(UploadsService);
    jest.clearAllMocks();
  });

  const makeFile = (overrides: Partial<Express.Multer.File> = {}): Express.Multer.File =>
    ({
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('fake'),
      originalname: 'test.jpg',
      ...overrides,
    }) as Express.Multer.File;

  it('rejects when no file is provided', () => {
    expect(() => service.validateFile(undefined)).toThrow(BadRequestException);
  });

  it('rejects disallowed mime types', () => {
    expect(() => service.validateFile(makeFile({ mimetype: 'application/pdf' }))).toThrow(
      BadRequestException,
    );
  });

  it('rejects files over 5MB', () => {
    expect(() => service.validateFile(makeFile({ size: 6 * 1024 * 1024 }))).toThrow(
      BadRequestException,
    );
  });

  it('accepts a valid jpg under the size limit', () => {
    expect(() => service.validateFile(makeFile())).not.toThrow();
  });

  it('delegates to the storage provider on upload', async () => {
    mockStorage.upload.mockResolvedValue({ url: 'http://x/y.jpg', publicId: 'y' });
    const result = await service.uploadImage(makeFile());
    expect(mockStorage.upload).toHaveBeenCalled();
    expect(result.publicId).toBe('y');
  });
});
