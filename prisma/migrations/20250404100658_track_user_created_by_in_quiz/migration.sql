/*
  Warnings:

  - You are about to drop the `_QuizToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdById` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_QuizToUser" DROP CONSTRAINT "_QuizToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_QuizToUser" DROP CONSTRAINT "_QuizToUser_B_fkey";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "createdById" TEXT NOT NULL;

-- DropTable
DROP TABLE "_QuizToUser";

-- CreateTable
CREATE TABLE "_UsersTakingQuizzes" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UsersTakingQuizzes_AB_unique" ON "_UsersTakingQuizzes"("A", "B");

-- CreateIndex
CREATE INDEX "_UsersTakingQuizzes_B_index" ON "_UsersTakingQuizzes"("B");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersTakingQuizzes" ADD CONSTRAINT "_UsersTakingQuizzes_A_fkey" FOREIGN KEY ("A") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersTakingQuizzes" ADD CONSTRAINT "_UsersTakingQuizzes_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
