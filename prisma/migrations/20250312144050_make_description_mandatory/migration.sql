/*
  Warnings:

  - Made the column `description` on table `Quiz` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Quiz" ALTER COLUMN "description" SET NOT NULL;
