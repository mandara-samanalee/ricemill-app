-- CreateEnum
CREATE TYPE "PaddyType" AS ENUM ('DRY', 'WET');

-- CreateTable
CREATE TABLE "paddy_entries" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "customerName" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "paddyType" "PaddyType" NOT NULL,
    "amountKg" DOUBLE PRECISION NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paddy_entries_pkey" PRIMARY KEY ("id")
);
