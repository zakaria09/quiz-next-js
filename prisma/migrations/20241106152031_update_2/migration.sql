/*
  Warnings:

  - You are about to drop the column `questionId` on the `Answer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[choiceId]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `choiceId` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_questionId_fkey";

-- DropIndex
DROP INDEX "Answer_questionId_key";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "questionId",
ADD COLUMN     "choiceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Answer_choiceId_key" ON "Answer"("choiceId");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
