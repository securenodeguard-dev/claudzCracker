# Database

MongoDB, accessed via Mongoose. Local: `mongodb://localhost:27017/cracker_shop`. Production: MongoDB Atlas. Use separate logical databases for QA (`cracker_shop_qa`) and production (`cracker_shop_prod`) — never test destructive operations against production data.

## Collections

### `admins`

| Field         | Type    | Notes                                   |
|---------------|---------|------------------------------------------|
| name          | String  |                                          |
| email         | String  | unique, lowercase, indexed              |
| passwordHash  | String  | bcrypt hash only; `select: false`       |
| role          | String  | `"admin"`                               |
| isActive      | Boolean | inactive admins can no longer log in    |
| createdAt / updatedAt | Date | via Mongoose timestamps       |

### `categories`

| Field       | Type    | Notes                        |
|-------------|---------|-------------------------------|
| name        | String  |                                |
| slug        | String  | unique, indexed, auto-derived from name |
| description | String  | optional                      |
| sortOrder   | Number  | controls display order        |
| isActive    | Boolean | inactive = hidden from consumer site |

### `products`

| Field         | Type      | Notes                                  |
|---------------|-----------|------------------------------------------|
| name          | String    |                                          |
| slug          | String    | unique, indexed, auto-derived from name |
| categoryId    | ObjectId  | ref `Category`, indexed                 |
| description   | String    | optional                                |
| price         | Number \| null | optional                           |
| showPrice     | Boolean   | consumer site hides price unless true   |
| imageUrl      | String \| null | Cloudinary secure URL (or local fallback path) |
| imagePublicId | String \| null | Cloudinary public ID, needed to delete/replace the image |
| sortOrder     | Number    |                                          |
| isActive      | Boolean   | archived products are `isActive: false` (soft delete) |

Compound index: `{ categoryId: 1, isActive: 1, sortOrder: 1 }` for the public product-listing query.

### `site_settings`

Singleton document (only one row ever exists — `SiteSettingsService.get()` creates it with defaults on first access).

| Field         | Type   |
|---------------|--------|
| businessName  | String |
| tagline       | String |
| logoUrl       | String |
| phone         | String |
| whatsapp      | String |
| email         | String |
| address       | String |
| googleMapsUrl | String |
| openingHours  | String |
| socialLinks   | `{ facebook, instagram, youtube }` |

## Soft deletes

Both categories and products use `isActive: false` rather than a hard delete:

- Products reference categories by `categoryId`; hard-deleting a category could orphan products.
- Admins likely want to temporarily hide a seasonal product/category without losing its data.
- The public API filters `isActive: true` everywhere, so a deactivated record simply disappears from the consumer site immediately.

## Backups

Configure automated backups on the MongoDB Atlas plan selected for QA/production (see `docs/deployment.md`). Local/dev data is disposable by design.
