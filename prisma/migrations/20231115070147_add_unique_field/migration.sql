/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[label]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Group_label_key" ON "Group"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_label_key" ON "Problem"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Team_label_key" ON "Team"("label");
