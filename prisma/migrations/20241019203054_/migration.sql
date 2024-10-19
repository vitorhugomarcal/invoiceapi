/*
  Warnings:

  - The primary key for the `SupplierUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `companyId` on the `SupplierUser` table. All the data in the column will be lost.
  - Added the required column `company_id` to the `SupplierUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SupplierUser" DROP CONSTRAINT "SupplierUser_companyId_fkey";

-- AlterTable
ALTER TABLE "SupplierUser" DROP CONSTRAINT "SupplierUser_pkey",
DROP COLUMN "companyId",
ADD COLUMN     "company_id" TEXT NOT NULL,
ADD CONSTRAINT "SupplierUser_pkey" PRIMARY KEY ("supplier_id", "company_id");

-- AddForeignKey
ALTER TABLE "SupplierUser" ADD CONSTRAINT "SupplierUser_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
