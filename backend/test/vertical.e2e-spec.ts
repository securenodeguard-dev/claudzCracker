/**
 * End-to-end test of the critical vertical flow described in the project
 * specification:
 *
 *   Admin Login -> Create Category -> Upload Product Image -> Create Product
 *   -> MongoDB stores metadata -> Cloudinary/local storage stores image
 *   -> Consumer API reads product -> Consumer website displays product
 *
 * Requires a MongoDB instance reachable at MONGODB_URI (defaults to
 * mongodb://localhost:27017/cracker_shop_test) and an admin already seeded,
 * OR runs against a freshly created admin created inline below.
 *
 * Run with: npm run test:e2e   (from the backend/ directory)
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from '../src/app.module';
import { Admin } from '../src/auth/schemas/admin.schema';

describe('Critical vertical flow (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let categoryId: string;
  let productSlug: string;

  const testAdminEmail = `e2e-admin-${Date.now()}@example.com`;
  const testAdminPassword = 'e2e-test-password-123';

  beforeAll(async () => {
    process.env.MONGODB_URI =
      process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/cracker_shop_test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api/v1', { exclude: ['health'] });
    await app.init();

    // Seed a throwaway admin directly via the Mongoose model so the test
    // doesn't depend on scripts/seed-admin.ts having been run beforehand.
    const adminModel = moduleFixture.get(getModelToken(Admin.name));
    await adminModel.create({
      name: 'E2E Admin',
      email: testAdminEmail,
      passwordHash: await bcrypt.hash(testAdminPassword, 4),
      role: 'admin',
      isActive: true,
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Admin logs in and receives a JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: testAdminEmail, password: testAdminPassword })
      .expect(200);

    expect(res.body.accessToken).toBeDefined();
    accessToken = res.body.accessToken;
  });

  it('2. Admin creates a category', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: `E2E Category ${Date.now()}` })
      .expect(201);

    expect(res.body._id).toBeDefined();
    categoryId = res.body._id;
  });

  it('3. Admin uploads a product image', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/admin/uploads/image')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), {
        filename: 'test.jpg',
        contentType: 'image/jpeg',
      })
      .expect(201);

    expect(res.body.url).toBeDefined();
    expect(res.body.publicId).toBeDefined();
  });

  it('4. Admin creates a product with that category and image', async () => {
    const name = `E2E Product ${Date.now()}`;
    const res = await request(app.getHttpServer())
      .post('/api/v1/admin/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name,
        categoryId,
        description: 'Created by the vertical-flow e2e test',
        price: 199,
        showPrice: true,
      })
      .expect(201);

    expect(res.body.slug).toBeDefined();
    productSlug = res.body.slug;
  });

  it('5. Consumer (public, unauthenticated) API can read the product', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/products/${productSlug}`)
      .expect(200);

    expect(res.body.slug).toBe(productSlug);
    expect(res.body.isActive).toBe(true);
  });

  it('6. Product appears in the public product list for its category', async () => {
    const category = await request(app.getHttpServer())
      .get('/api/v1/categories')
      .expect(200);
    const created = category.body.find((c: any) => c._id === categoryId);
    expect(created).toBeDefined();

    const res = await request(app.getHttpServer())
      .get(`/api/v1/products?category=${created.slug}`)
      .expect(200);

    expect(res.body.some((p: any) => p.slug === productSlug)).toBe(true);
  });
});
