/*
  Warnings:

  - Added the required column `neighborhood` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "neighborhood" TEXT NOT NULL;
