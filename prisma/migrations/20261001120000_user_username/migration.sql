-- AlterTable
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- Backfill existing rows from email local-part (unique enough for seed data)
UPDATE "User"
SET "username" = lower(split_part("email", '@', 1))
WHERE "username" IS NULL;

-- Ensure uniqueness if collisions (append short id suffix)
UPDATE "User" u
SET "username" = u."username" || '_' || left(u."id", 4)
WHERE EXISTS (
  SELECT 1 FROM "User" o
  WHERE o."username" = u."username" AND o."id" <> u."id"
);

ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
