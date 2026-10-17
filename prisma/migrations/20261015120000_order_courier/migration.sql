-- AlterTable
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "courierProvider" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "courierConsignmentId" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "courierStatus" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "courierBookedAt" TIMESTAMP(3);
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "courierLastSyncAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Order_courierConsignmentId_idx" ON "Order"("courierConsignmentId");
CREATE INDEX IF NOT EXISTS "Order_courierStatus_idx" ON "Order"("courierStatus");
