/*
  Warnings:

  - You are about to drop the column `requestId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_requestId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "requestId";

-- CreateTable
CREATE TABLE "_RequestToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RequestToUser_AB_unique" ON "_RequestToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RequestToUser_B_index" ON "_RequestToUser"("B");

-- AddForeignKey
ALTER TABLE "_RequestToUser" ADD CONSTRAINT "_RequestToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RequestToUser" ADD CONSTRAINT "_RequestToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
