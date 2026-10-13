-- Dynamic brands: Brand table + Device.brandId (replaces DeviceBrand enum)

CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "shortLabel" TEXT,
    "blurb" TEXT NOT NULL DEFAULT '',
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");
CREATE UNIQUE INDEX "Brand_code_key" ON "Brand"("code");
CREATE INDEX "Brand_position_idx" ON "Brand"("position");

INSERT INTO "Brand" ("id", "slug", "code", "label", "shortLabel", "blurb", "position", "createdAt", "updatedAt")
VALUES
  (
    'brand_apple_seed',
    'iphone',
    'APPLE',
    'iPhone',
    'iPhone',
    'Accessories cut to Apple''s exact tolerances — from screen armor and cases to camera kits for iPhone 15 through the latest Pro Max.',
    0,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  ),
  (
    'brand_samsung_seed',
    'samsung',
    'SAMSUNG',
    'Samsung Galaxy',
    'Samsung',
    'Ultrasonic-fingerprint friendly glass, cases and camera armor for Galaxy S and Z series flagships.',
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
  );

ALTER TABLE "Device" ADD COLUMN "brandId" TEXT;

UPDATE "Device" d
SET "brandId" = b."id"
FROM "Brand" b
WHERE b."code" = d."brand"::text;

ALTER TABLE "Device" ALTER COLUMN "brandId" SET NOT NULL;

ALTER TABLE "Device" DROP COLUMN "brand";

DROP INDEX IF EXISTS "Device_brand_position_idx";

CREATE INDEX "Device_brandId_position_idx" ON "Device"("brandId", "position");

ALTER TABLE "Device"
  ADD CONSTRAINT "Device_brandId_fkey"
  FOREIGN KEY ("brandId") REFERENCES "Brand"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

DROP TYPE "DeviceBrand";
