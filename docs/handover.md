# Handover Checklist

At project completion, provide the client with:

## Access & ownership

- [ ] GitHub repository transferred to (or collaborator access granted on) the client's own GitHub account/organization.
- [ ] Domain registrar account is client-owned; developers removed or downgraded to collaborator access post-handover.
- [ ] Netlify sites (consumer + admin) owned by the client's account; developers added as team members only if ongoing support is agreed.
- [ ] MongoDB Atlas project/organization owned by the client.
- [ ] Cloudinary account owned by the client.
- [ ] Render (or chosen backend host) account owned by the client.
- [ ] Google services (Search Console, Business Profile, Maps API key if used) owned by the client.

## Credentials

- [ ] Production admin login credentials delivered to the client **securely** (a password manager share, not email/chat/this document, and never committed to Git).
- [ ] All `.env` values for production documented for the client (see `.env.example` files) but the actual secret values are only ever stored in the hosting providers' environment variable settings — never in the repo.

## Documentation delivered

- [ ] `README.md` — quick start
- [ ] `docs/architecture.md` — system design
- [ ] `docs/database.md` — collections/schemas
- [ ] `docs/api.md` — REST API reference
- [ ] `docs/deployment.md` — QA/production deployment steps
- [ ] This file

## Training

- [ ] Walkthrough of the admin portal: login, categories, products (including image upload), site settings.
- [ ] Explanation that product/category changes appear on the consumer site immediately — no redeploy needed.
- [ ] Explanation of what "Archive" / "Deactivate" does (soft delete, not permanent removal) and how to reactivate.

## Backups & maintenance

- [ ] Confirm the MongoDB Atlas backup schedule/plan with the client.
- [ ] Document recurring costs: domain renewal, hosting plan(s), Atlas plan, Cloudinary plan (if paid tier needed).
- [ ] Agree on maintenance/support terms (who to contact for bugs, how feature requests are handled, response time expectations) — outside the scope of this codebase, to be defined contractually.

## Final verification

- [ ] Critical vertical flow re-verified on production: admin login → category → image upload → product creation → consumer site displays the product.
- [ ] HTTPS working on all three domains.
- [ ] Mobile layout checked on consumer site.
- [ ] Basic SEO checked (page titles, meta descriptions, sitemap.xml, robots.txt reachable).
