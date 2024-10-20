/*
  Warnings:

  - You are about to drop the column `user_id` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `estimates` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `payments_mode_custom` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `unit_types_custom` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SupplierUser" DROP CONSTRAINT "SupplierUser_user_id_fkey";

-- DropForeignKey
ALTER TABLE "clients" DROP CONSTRAINT "clients_user_id_fkey";

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_user_id_fkey";

-- DropForeignKey
ALTER TABLE "estimates" DROP CONSTRAINT "estimates_user_id_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_client_id_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_user_id_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_user_id_fkey";

-- DropForeignKey
ALTER TABLE "payments_mode_custom" DROP CONSTRAINT "payments_mode_custom_user_id_fkey";

-- DropForeignKey
ALTER TABLE "unit_types_custom" DROP CONSTRAINT "unit_types_custom_user_id_fkey";

-- AlterTable
ALTER TABLE "SupplierUser" ADD COLUMN     "companyId" TEXT;

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "user_id",
ADD COLUMN     "company_id" TEXT;

-- AlterTable
ALTER TABLE "estimates" DROP COLUMN "user_id",
ADD COLUMN     "company_id" TEXT;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "user_id",
ADD COLUMN     "company_id" TEXT,
ALTER COLUMN "client_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "items" DROP COLUMN "user_id",
ADD COLUMN     "company_id" TEXT;

-- AlterTable
ALTER TABLE "payments_mode_custom" DROP COLUMN "user_id",
ADD COLUMN     "company_id" TEXT;

-- AlterTable
ALTER TABLE "unit_types_custom" DROP COLUMN "user_id",
ADD COLUMN     "company_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "company_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierUser" ADD CONSTRAINT "SupplierUser_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments_mode_custom" ADD CONSTRAINT "payments_mode_custom_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unit_types_custom" ADD CONSTRAINT "unit_types_custom_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estimates" ADD CONSTRAINT "estimates_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
