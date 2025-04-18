/*
  Warnings:

  - Added the required column `questionId` to the `Explanation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Explanation" ADD COLUMN     "questionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Explanation" ADD CONSTRAINT "Explanation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
