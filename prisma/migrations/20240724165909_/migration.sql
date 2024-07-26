/*
  Warnings:

  - You are about to drop the column `country` on the `companies` table. All the data in the column will be lost.
  - Added the required column `number` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "country",
ADD COLUMN     "number" TEXT NOT NULL;
