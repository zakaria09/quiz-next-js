/*
  Warnings:

  - You are about to drop the column `choiceId` on the `Choice` table. All the data in the column will be lost.
  - Added the required column `questionId` to the `Choice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Choice" DROP CONSTRAINT "Choice_choiceId_fkey";

-- AlterTable
ALTER TABLE "Choice" DROP COLUMN "choiceId",
ADD COLUMN     "questionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
