/*
  Warnings:

  - You are about to drop the `Answer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_choiceId_fkey";

-- DropTable
DROP TABLE "Answer";

-- CreateTable
CREATE TABLE "Choice" (
    "id" SERIAL NOT NULL,
    "choice" TEXT NOT NULL,
    "choiceId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Choice" ADD CONSTRAINT "Choice_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
