-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('Active', 'Disabled');

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ServiceStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);
