/*
  Warnings:

  - The primary key for the `SupplierUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `SupplierUser` table. All the data in the column will be lost.
  - Made the column `companyId` on table `SupplierUser` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SupplierUser" DROP CONSTRAINT "SupplierUser_companyId_fkey";

-- AlterTable
ALTER TABLE "SupplierUser" DROP CONSTRAINT "SupplierUser_pkey",
DROP COLUMN "user_id",
ALTER COLUMN "companyId" SET NOT NULL,
ADD CONSTRAINT "SupplierUser_pkey" PRIMARY KEY ("supplier_id", "companyId");

-- AddForeignKey
ALTER TABLE "SupplierUser" ADD CONSTRAINT "SupplierUser_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
