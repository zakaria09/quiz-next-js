/*
  Warnings:

  - The primary key for the `Choice` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Choice" DROP CONSTRAINT "Choice_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Choice_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Choice_id_seq";
