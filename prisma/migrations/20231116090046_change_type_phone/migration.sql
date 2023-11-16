/*
  Warnings:

  - You are about to alter the column `phone` on the `Issue` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "phone" SET DATA TYPE VARCHAR(10);
