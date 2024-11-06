-- DropIndex
DROP INDEX "Answer_choiceId_key";

-- DropIndex
DROP INDEX "Question_quizId_key";

-- AlterTable
ALTER TABLE "Question" ALTER COLUMN "quizId" DROP DEFAULT;
DROP SEQUENCE "question_quizid_seq";
