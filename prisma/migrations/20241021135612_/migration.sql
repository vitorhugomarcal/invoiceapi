/*
  Warnings:

  - Added the required column `cpf` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "companies_cnpj_key";

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
