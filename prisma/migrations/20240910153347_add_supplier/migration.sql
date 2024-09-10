-- CreateTable
CREATE TABLE "sluppliers" (
    "id" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "address_number" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,

    CONSTRAINT "sluppliers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sluppliers_cnpj_key" ON "sluppliers"("cnpj");

-- AddForeignKey
ALTER TABLE "sluppliers" ADD CONSTRAINT "sluppliers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
