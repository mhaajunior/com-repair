/*
  Warnings:

  - A unique constraint covering the columns `[label,teamId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Group_label_key";

-- CreateIndex
CREATE UNIQUE INDEX "Group_label_teamId_key" ON "Group"("label", "teamId");
