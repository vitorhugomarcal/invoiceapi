-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "companies" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "items" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "payments_mode" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "payments_mode_custom" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "unit_types" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "unit_types_custom" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
