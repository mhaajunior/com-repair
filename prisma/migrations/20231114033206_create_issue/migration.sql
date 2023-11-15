-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'ACKNOWLEDGE', 'IN_PROGRESS', 'NOTIFY', 'CANT_FIX', 'CANCELED', 'CLOSED');

-- CreateTable
CREATE TABLE "Issue" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "surname" VARCHAR(32) NOT NULL,
    "team" INTEGER NOT NULL,
    "group" INTEGER NOT NULL,
    "phone" VARCHAR(10) NOT NULL,
    "problem" INTEGER NOT NULL,
    "detail" TEXT NOT NULL,
    "fixResult" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fixStartDate" TIMESTAMP(3) NOT NULL,
    "fixEndDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);
