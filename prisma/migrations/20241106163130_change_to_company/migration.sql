-- DropForeignKey
ALTER TABLE "SupplierUser" DROP CONSTRAINT "SupplierUser_company_id_fkey";

-- AddForeignKey
ALTER TABLE "SupplierUser" ADD CONSTRAINT "SupplierUser_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
