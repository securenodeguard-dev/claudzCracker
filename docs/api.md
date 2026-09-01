# REST API Reference

Base URL: `http://localhost:3000/api/v1` (local) — see `docs/deployment.md` for QA/prod URLs.
Interactive Swagger/OpenAPI docs are always available at `/api/docs` (e.g. `http://localhost:3000/api/docs`).

All request/response bodies are JSON unless noted (image upload uses `multipart/form-data`).

## Health

```
GET /health          (outside the /api/v1 prefix)
→ { "status": "ok" }
```

## Auth

```
POST /api/v1/auth/login
Body: { "email": "admin@example.com", "password": "..." }
→ 200 { "accessToken": "...", "admin": { "id", "name", "email", "role" } }
→ 401 on invalid credentials or inactive account
Rate limited: 5 requests / 60s per IP.
```

## Public — Categories

```
GET /api/v1/categories                → active categories, sorted by sortOrder
GET /api/v1/categories/:slug          → a single active category, 404 if not found/inactive
```

## Public — Products

```
GET /api/v1/products                  → active products (active category only)
GET /api/v1/products?category=sparklers
GET /api/v1/products?q=rocket         → case-insensitive search on name/description
GET /api/v1/products/:slug            → a single active product, 404 if not found/inactive
```

## Public — Site Settings

```
GET /api/v1/site-settings/public      → business/contact info
```

## Admin — Categories (JWT required, `Authorization: Bearer <token>`)

```
GET    /api/v1/admin/categories       → all categories (active + inactive)
POST   /api/v1/admin/categories       → create
PATCH  /api/v1/admin/categories/:id   → update / reorder / (de)activate
DELETE /api/v1/admin/categories/:id   → soft delete (sets isActive: false)
```

`CreateCategoryDto`: `{ name (required), description?, sortOrder?, isActive? }`

## Admin — Products (JWT required)

```
GET    /api/v1/admin/products         → all products (active + inactive), populated category
GET    /api/v1/admin/products/:id
POST   /api/v1/admin/products         → create
PATCH  /api/v1/admin/products/:id     → update fields / status / sort order
DELETE /api/v1/admin/products/:id     → archive (sets isActive: false)
```

`CreateProductDto`: `{ name, categoryId (Mongo ObjectId), description?, price?, showPrice?, sortOrder?, isActive?, imageUrl?, imagePublicId? }`

`imageUrl`/`imagePublicId` are normally set via the upload flow below, then passed through when creating/updating the product.

## Admin — Uploads (JWT required)

```
POST /api/v1/admin/uploads/image
Content-Type: multipart/form-data, field name "file"
→ 201 { "url": "https://res.cloudinary.com/...", "publicId": "cracker-shop/products/..." }
```

Accepts `jpg`, `jpeg`, `png`, `webp`. Max size 5 MB. Rejects anything else with `400 Bad Request`.
Rate limited: 10 requests / 60s per IP.

## Admin — Site Settings (JWT required)

```
GET   /api/v1/admin/site-settings     → current settings (auto-created with defaults on first call)
PATCH /api/v1/admin/site-settings     → partial update
```

## Error shape

Every error response (validation, auth, not found, unexpected) has this shape:

```json
{
  "statusCode": 400,
  "path": "/api/v1/admin/products",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "message": "Validation failed" // or an array of field errors
}
```
