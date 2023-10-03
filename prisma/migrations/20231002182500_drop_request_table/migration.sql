/*
  Warnings:

  - You are about to drop the `Request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RequestToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "_RequestToUser" DROP CONSTRAINT "_RequestToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RequestToUser" DROP CONSTRAINT "_RequestToUser_B_fkey";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "isRequest" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Request";

-- DropTable
DROP TABLE "_RequestToUser";
