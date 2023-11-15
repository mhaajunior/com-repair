-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_problemId_fkey";

-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_teamId_fkey";

-- AlterTable
ALTER TABLE "Group" ALTER COLUMN "teamId" DROP NOT NULL,
ALTER COLUMN "teamId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "groupId" DROP NOT NULL,
ALTER COLUMN "groupId" DROP DEFAULT,
ALTER COLUMN "problemId" DROP NOT NULL,
ALTER COLUMN "problemId" DROP DEFAULT,
ALTER COLUMN "teamId" DROP NOT NULL,
ALTER COLUMN "teamId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
