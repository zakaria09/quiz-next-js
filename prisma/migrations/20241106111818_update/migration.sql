/*
  Warnings:

  - You are about to drop the `Choice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Choice" DROP CONSTRAINT "Choice_questionId_fkey";

-- AlterTable
CREATE SEQUENCE question_quizid_seq;
ALTER TABLE "Question" ALTER COLUMN "quizId" SET DEFAULT nextval('question_quizid_seq');
ALTER SEQUENCE question_quizid_seq OWNED BY "Question"."quizId";

-- DropTable
DROP TABLE "Choice";

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "choice" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Answer_questionId_key" ON "Answer"("questionId");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
