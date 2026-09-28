# HYDRA

Premium screen protection for iPhone and Samsung Galaxy — a Bangladesh-focused (BDT) storefront with an authenticity-verification system and an admin console.

**Stack:** Next.js 16 (App Router, TypeScript) · PostgreSQL · Prisma 7 · Tailwind CSS v4 · Zod 4 · pnpm

## Quick start

No Docker needed. Create a free hosted Postgres database on [Neon](https://neon.tech) (or Supabase / Prisma Postgres). Then:

```bash
pnpm install              # also runs `prisma generate`
cp .env.example .env      # set DATABASE_URL, DIRECT_URL, AUTH_SECRET (32+ chars)
pnpm db:deploy            # apply migrations
pnpm db:seed              # demo catalog, pages, codes, orders, owner account
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
| Verification demo code  | `HYD-DEMO-0001`                                    |

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
  schema.prisma          data model (products, devices, orders, codes, CMS…)
  migrations/            SQL migrations
  seed.ts                demo data (refuses to run in production without SEED_FORCE=1)
public/products/         placeholder product artwork
src/
  app/
    (store)/             public storefront: home, shop, product, installation,
                         verify, support, about, contact, cart, checkout, legal
    admin/               login + (dashboard) console: products, orders, catalog,
                         reviews, inquiries, verifications, content
    api/                 JSON endpoints
    sitemap.ts robots.ts
  components/
    ui/                  design-system primitives (button, form, badge…)
    layout/ sections/    header, mega menu, footer, homepage sections
    product/ cart/ shop/ checkout/ forms/ admin/ …
  config/                site config + navigation
  content/               static FAQ + installation guides
  lib/                   db client, auth, validation, pricing, SEO, rate limiting
  server/
    queries/             cached read models (catalog, content)
    actions/             server actions (checkout, verify, auth, admin…)
  proxy.ts               guards /admin routes
  generated/prisma/      generated Prisma client (git-ignored)
```

## Key behaviour

- **Money** is stored as whole BDT integers. Shipping: ৳70 inside Dhaka, ৳130 outside, free over ৳1,500.
- **Checkout** re-prices every line from the database and decrements stock atomically inside a transaction.
- **Verification** codes (`HYD-XXXX-XXXXX`) are generated in batches from the admin console. Every lookup is logged and can be exported as CSV.
- **Caching:** catalog pages use ISR and tag-based revalidation. Admin edits refresh the storefront immediately.
- **Security:** bcrypt passwords, an HS256 JWT session cookie, Zod on every input, honeypot fields, rate limiting, and strict security headers.
- **Analytics:** GTM and Meta Pixel load only after cookie consent (`NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`).

## Not yet implemented

- bKash, Nagad and SSLCommerz payments. They are stubbed and shown as "coming soon"; only Cash on Delivery works.
- Customer accounts. Admin auth only.
- Transactional email.
- Image upload. Product images are entered as URLs.
- Editing product variants in the admin form. Variants are seeded.
- A shared rate-limit store. The current limiter is in-memory, so each Vercel function instance counts requests separately; switch to Upstash Redis for strict limits.
- Phase 2 items: multi-currency, blog, and affiliate pages.
