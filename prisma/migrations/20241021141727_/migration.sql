/*
  Warnings:

  - You are about to drop the column `cpf` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `companies` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnpj]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Made the column `cnpj` on table `companies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `owner_id` on table `companies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "cpf",
DROP COLUMN "type",
ALTER COLUMN "cnpj" SET NOT NULL,
ALTER COLUMN "owner_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "companies_cnpj_key" ON "companies"("cnpj");
