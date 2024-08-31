/*
  Warnings:

  - You are about to drop the column `unit_name` on the `invoice_items` table. All the data in the column will be lost.
  - Added the required column `unit` to the `invoice_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoice_items" DROP COLUMN "unit_name",
ADD COLUMN     "unit" TEXT NOT NULL;
