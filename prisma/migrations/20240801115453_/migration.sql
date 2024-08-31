/*
  Warnings:

  - You are about to drop the column `name` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `companies` table. All the data in the column will be lost.
  - Added the required column `address_number` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_name` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "name",
DROP COLUMN "number",
ADD COLUMN     "address_number" TEXT NOT NULL,
ADD COLUMN     "company_name" TEXT NOT NULL;
