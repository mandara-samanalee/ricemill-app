-- CreateEnum
CREATE TYPE "RiceType" AS ENUM ('TRIPLE', 'DOUBLE', 'SINGLE');

-- CreateEnum
CREATE TYPE "PackageType" AS ENUM ('KG_5', 'KG_10', 'KG_25', 'KG_50');

-- CreateTable
CREATE TABLE "rice_orders" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerAddress" TEXT,
    "customerPhone" TEXT,
    "note" TEXT,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rice_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rice_order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "riceType" "RiceType" NOT NULL,
    "packageType" "PackageType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalSize" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "rice_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing" (
    "id" SERIAL NOT NULL,
    "riceType" "RiceType" NOT NULL,
    "packageType" "PackageType" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pricing_riceType_packageType_key" ON "pricing"("riceType", "packageType");

-- AddForeignKey
ALTER TABLE "rice_order_items" ADD CONSTRAINT "rice_order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "rice_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
