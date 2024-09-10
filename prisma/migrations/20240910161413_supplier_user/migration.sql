/*
  Warnings:

  - You are about to drop the `_SupplierToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SupplierToUser" DROP CONSTRAINT "_SupplierToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SupplierToUser" DROP CONSTRAINT "_SupplierToUser_B_fkey";

-- DropTable
DROP TABLE "_SupplierToUser";

-- CreateTable
CREATE TABLE "SupplierUser" (
    "supplier_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "SupplierUser_pkey" PRIMARY KEY ("supplier_id","user_id")
);

-- AddForeignKey
ALTER TABLE "SupplierUser" ADD CONSTRAINT "SupplierUser_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "sluppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierUser" ADD CONSTRAINT "SupplierUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
