import { CompostReport, Transaction } from "@prisma/client";

export type TransactionDTO = Pick<Transaction, 'category' | 'amount' | 'purchaserId' | 'reason'> & {
    recipientPhoneNumber: string;
};

export interface DepositDTO {
  userId: string;
  compostReport: CompostReport;
}
