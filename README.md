# HYDRA

Premium screen protection for iPhone and Samsung Galaxy — a worldwide (USD) storefront with an admin console for catalog, orders and editable site content.

**Stack:** Next.js 16 (App Router, TypeScript) · PostgreSQL · Prisma 7 · Tailwind CSS v4 · Zod 4 · pnpm

## Quick start

No Docker needed. Create a free hosted Postgres database on [Neon](https://neon.tech) (or Supabase / Prisma Postgres). Optionally add free [Upstash Redis](https://console.upstash.com) for admin cache + rate limits. Then:

```bash
pnpm install              # also runs `prisma generate`
cp .env.example .env      # set DATABASE_URL, DIRECT_URL, AUTH_SECRET (32+ chars)
                          # optional: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
pnpm db:deploy            # apply migrations
pnpm db:seed              # demo catalog, pages, sections, orders, owner account
pnpm dev                  # http://localhost:3000
```

## Deploy to Vercel

1. Push the repo to GitHub and import it in Vercel. The Next.js framework and pnpm are detected automatically.
2. In **Project → Settings → Environment Variables**, add:

   | Variable               | Value                                               |
   | ---------------------- | --------------------------------------------------- |
   | `DATABASE_URL`         | Neon **pooled** connection string                   |
   | `DIRECT_URL`           | Neon **direct** connection string                   |
   | `AUTH_SECRET`          | 32+ char random string                              |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com`                           |
   | `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | optional                 |

   With the Neon integration from the Vercel Marketplace, the database variables are added for you.
3. Deploy. The `vercel-build` script runs `prisma migrate deploy` before `next build`, so the schema is always up to date.
4. Seed once, from your machine, against the production database: `pnpm db:seed`. This creates the owner account and demo catalog. Then change the admin password.

> The build prerenders product pages, so the database must be reachable at build time.

| Demo item               | Value                                              |
| ----------------------- | -------------------------------------------------- |
| Admin console           | `/admin` — `admin@hydra.com.bd` / `SEED_ADMIN_PASSWORD` |

### Scripts

| Script           | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `pnpm dev`       | Dev server                               |
| `pnpm build`     | Production build (needs a reachable DB)  |
| `pnpm typecheck` | `tsc --noEmit`                           |
| `pnpm lint`      | ESLint                                   |
| `pnpm db:migrate`| Create/apply a migration in development  |
| `pnpm db:studio` | Prisma Studio                            |
| `pnpm db:reset`  | Drop, re-migrate and re-seed             |

## Folder structure

```
prisma/
  schema.prisma          data model (products, devices, orders, CMS sections…)
  migrations/            SQL migrations
  seed.ts                demo data (refuses to run in production without SEED_FORCE=1)
public/products/         placeholder product artwork
src/
  app/
    (store)/             public storefront: home, shop, product, installation,
                         support, about, contact, cart, checkout, legal
    admin/               login + (dashboard) console: products, orders, catalog,
                         reviews, inquiries, content, team
    api/                 JSON endpoints
    sitemap.ts robots.ts
  components/
    ui/                  design-system primitives (button, form, badge…)
    layout/ sections/    header, mega menu, footer, homepage sections
    product/ cart/ shop/ checkout/ forms/ admin/ …
  config/                site config + navigation
  content/               static FAQ + installation guides + section defaults
  lib/                   db client, auth, validation, pricing, SEO, rate limiting
  server/
    queries/             cached read models (catalog, content)
    actions/             server actions (checkout, auth, admin…)
  proxy.ts               guards /admin routes
  generated/prisma/      generated Prisma client (git-ignored)
```

## Key behaviour

- **Money** is stored as whole USD integers. Shipping: $8 express hubs, $14 standard, free over $80.
- **Checkout** re-prices every line from the database and decrements stock atomically inside a transaction.
- **Site sections:** About + home blocks (collections, how-it-works, newsletter) are editable JSON in admin (`SiteSection`), with safe href/image validation on save and normalize-on-read.
- **Reports:** Admin can download HTML/CSV order and product statements from the orders and products screens.
- **Caching:** catalog pages use ISR and tag-based revalidation. Admin uses a versioned cache-aside layer (`src/lib/admin-cache.ts`) on Upstash Redis with tag invalidation, hit metadata, and Overview → Purge cache. Rate limits also use Redis. Without `UPSTASH_REDIS_*`, both fall back to process memory.
- **Security:** bcrypt passwords, an HS256 JWT session cookie, Zod on storefront inputs, honeypot fields, rate limiting, and strict security headers.
- **Analytics:** GTM and Meta Pixel load only after cookie consent (`NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`).

## Not yet implemented

- Mobile wallet and card payments. They are stubbed and shown as "coming soon"; only pay-on-delivery works where offered.
- Customer accounts. Admin auth only.
- Transactional email.
- Image upload. Product images are entered as URLs.
- Editing product variants in the admin form. Variants are seeded.
- Phase 2 items: multi-currency, blog, and affiliate pages.
