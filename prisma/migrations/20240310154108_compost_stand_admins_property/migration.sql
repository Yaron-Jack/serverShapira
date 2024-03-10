-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminCompostStandId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_adminCompostStandId_fkey" FOREIGN KEY ("adminCompostStandId") REFERENCES "CompostStand"("compostStandId") ON DELETE SET NULL ON UPDATE CASCADE;
