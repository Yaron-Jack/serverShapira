/*
  Warnings:

  - The primary key for the `CompostStand` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CompostStandId` on the `CompostStand` table. All the data in the column will be lost.
  - Added the required column `compostStandId` to the `CompostStand` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CompostReport" DROP CONSTRAINT "CompostReport_compostStandId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userLocalCompostStandId_fkey";

-- AlterTable
ALTER TABLE "CompostStand" DROP CONSTRAINT "CompostStand_pkey",
DROP COLUMN "CompostStandId",
ADD COLUMN     "compostStandId" INTEGER NOT NULL,
ADD CONSTRAINT "CompostStand_pkey" PRIMARY KEY ("compostStandId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userLocalCompostStandId_fkey" FOREIGN KEY ("userLocalCompostStandId") REFERENCES "CompostStand"("compostStandId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompostReport" ADD CONSTRAINT "CompostReport_compostStandId_fkey" FOREIGN KEY ("compostStandId") REFERENCES "CompostStand"("compostStandId") ON DELETE RESTRICT ON UPDATE CASCADE;
