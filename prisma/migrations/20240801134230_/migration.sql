/*
  Warnings:

  - You are about to drop the column `emailAddress` on the `clients` table. All the data in the column will be lost.
  - Added the required column `email_address` to the `clients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clients" DROP COLUMN "emailAddress",
ADD COLUMN     "email_address" TEXT NOT NULL;
