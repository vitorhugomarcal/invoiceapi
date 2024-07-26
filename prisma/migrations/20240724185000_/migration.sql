/*
  Warnings:

  - You are about to drop the column `country` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `clients` table. All the data in the column will be lost.
  - Added the required column `emailAddress` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "country",
DROP COLUMN "email",
ADD COLUMN     "emailAddress" TEXT NOT NULL;
