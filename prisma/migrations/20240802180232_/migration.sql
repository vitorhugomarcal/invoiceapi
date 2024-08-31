/*
  Warnings:

  - Changed the type of `price` on the `invoice_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `quantity` on the `invoice_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `total` on the `invoice_items` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `sub_total` on the `invoices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `total` on the `invoices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "invoice_items" DROP COLUMN "price",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
DROP COLUMN "quantity",
ADD COLUMN     "quantity" DECIMAL(65,30) NOT NULL,
DROP COLUMN "total",
ADD COLUMN     "total" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "sub_total",
ADD COLUMN     "sub_total" DECIMAL(65,30) NOT NULL,
DROP COLUMN "total",
ADD COLUMN     "total" DECIMAL(65,30) NOT NULL;
