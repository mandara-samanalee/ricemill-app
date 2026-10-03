/*
  Warnings:

  - Added the required column `totalPackages` to the `rice_orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalSize` to the `rice_orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rice_orders" ADD COLUMN     "totalPackages" INTEGER NOT NULL,
ADD COLUMN     "totalSize" DOUBLE PRECISION NOT NULL;
