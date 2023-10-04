-- AlterTable
ALTER TABLE "User" ADD COLUMN     "requestId" TEXT;

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "requesterUserId" TEXT NOT NULL,
    "requestedFromUserId" TEXT NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Request_transactionId_key" ON "Request"("transactionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
