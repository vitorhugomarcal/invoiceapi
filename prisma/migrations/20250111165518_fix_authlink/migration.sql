/*
  Warnings:

  - You are about to drop the column `code` on the `auth_links` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `auth_links` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `auth_links` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "auth_links_code_key";

-- AlterTable
ALTER TABLE "auth_links" DROP COLUMN "code",
ADD COLUMN     "token" TEXT NOT NULL,
ALTER COLUMN "expiresAt" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "auth_links_token_key" ON "auth_links"("token");

-- AddForeignKey
ALTER TABLE "auth_links" ADD CONSTRAINT "auth_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
