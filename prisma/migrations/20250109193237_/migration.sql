/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `auth_links` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "auth_links_code_key" ON "auth_links"("code");
