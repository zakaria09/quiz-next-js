-- CreateTable
CREATE TABLE "_QuizToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuizToUser_AB_unique" ON "_QuizToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_QuizToUser_B_index" ON "_QuizToUser"("B");

-- AddForeignKey
ALTER TABLE "_QuizToUser" ADD CONSTRAINT "_QuizToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuizToUser" ADD CONSTRAINT "_QuizToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
