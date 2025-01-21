-- CreateEnum
CREATE TYPE "Type" AS ENUM ('basic', 'pro', 'team');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'basic';
