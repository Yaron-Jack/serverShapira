/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('GROCERIES', 'MISC', 'GARDEN', 'GIFT');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('BASIC', 'ADMIN');

-- CreateEnum
CREATE TYPE "DRYMATTERPRESENT" AS ENUM ('yes', 'some', 'no');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "name",
ADD COLUMN     "accountBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lastName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'BASIC',
ADD COLUMN     "userLocalCompostStandId" INTEGER,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "Category" NOT NULL,
    "purchaserId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompostStand" (
    "CompostStandId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CompostStand_pkey" PRIMARY KEY ("CompostStandId")
);

-- CreateTable
CREATE TABLE "CompostReport" (
    "compostStandId" INTEGER NOT NULL,
    "depositWeight" DECIMAL(65,30) NOT NULL,
    "compostSmell" BOOLEAN NOT NULL,
    "dryMatterPresent" "DRYMATTERPRESENT" NOT NULL,
    "notes" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TransactionToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CompostReport_compostStandId_key" ON "CompostReport"("compostStandId");

-- CreateIndex
CREATE UNIQUE INDEX "_TransactionToUser_AB_unique" ON "_TransactionToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TransactionToUser_B_index" ON "_TransactionToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userLocalCompostStandId_fkey" FOREIGN KEY ("userLocalCompostStandId") REFERENCES "CompostStand"("CompostStandId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompostReport" ADD CONSTRAINT "CompostReport_compostStandId_fkey" FOREIGN KEY ("compostStandId") REFERENCES "CompostStand"("CompostStandId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompostReport" ADD CONSTRAINT "CompostReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TransactionToUser" ADD CONSTRAINT "_TransactionToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TransactionToUser" ADD CONSTRAINT "_TransactionToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
