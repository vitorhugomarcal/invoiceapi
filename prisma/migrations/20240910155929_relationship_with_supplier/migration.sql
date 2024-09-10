-- DropForeignKey
ALTER TABLE "sluppliers" DROP CONSTRAINT "sluppliers_user_id_fkey";

-- CreateTable
CREATE TABLE "_SupplierToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SupplierToUser_AB_unique" ON "_SupplierToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SupplierToUser_B_index" ON "_SupplierToUser"("B");

-- AddForeignKey
ALTER TABLE "_SupplierToUser" ADD CONSTRAINT "_SupplierToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "sluppliers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SupplierToUser" ADD CONSTRAINT "_SupplierToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
