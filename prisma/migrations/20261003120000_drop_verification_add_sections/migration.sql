-- Drop authenticity / verification system
DROP TABLE IF EXISTS "VerificationAttempt";
DROP TABLE IF EXISTS "AuthenticityCode";
DROP TYPE IF EXISTS "VerificationResult";
DROP TYPE IF EXISTS "CodeStatus";

-- Editable storefront sections
CREATE TABLE "SiteSection" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSection_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SiteSection_key_key" ON "SiteSection"("key");
