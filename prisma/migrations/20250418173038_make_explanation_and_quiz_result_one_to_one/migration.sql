/*
  Warnings:

  - You are about to drop the column `questionId` on the `Explanation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[quizResultId]` on the table `Explanation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quizResultId` to the `Explanation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Explanation" DROP CONSTRAINT "Explanation_questionId_fkey";

-- DropIndex
DROP INDEX "Explanation_questionId_key";

-- AlterTable
ALTER TABLE "Explanation" DROP COLUMN "questionId",
ADD COLUMN     "quizResultId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Explanation_quizResultId_key" ON "Explanation"("quizResultId");

-- AddForeignKey
ALTER TABLE "Explanation" ADD CONSTRAINT "Explanation_quizResultId_fkey" FOREIGN KEY ("quizResultId") REFERENCES "QuizResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
