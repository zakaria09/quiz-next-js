/*
  Warnings:

  - You are about to drop the `_UsersTakingQuizzes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UsersTakingQuizzes" DROP CONSTRAINT "_UsersTakingQuizzes_A_fkey";

-- DropForeignKey
ALTER TABLE "_UsersTakingQuizzes" DROP CONSTRAINT "_UsersTakingQuizzes_B_fkey";

-- DropTable
DROP TABLE "_UsersTakingQuizzes";
