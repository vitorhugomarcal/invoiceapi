-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL DEFAULT 'uuid',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
