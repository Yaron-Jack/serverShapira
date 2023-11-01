import { DRYMATTERPRESENT, Transaction, User } from "@prisma/client";
import { CompostStandName } from "../constants/compostStands";

export type TransactionDTO = Pick<Transaction, 'category' | 'amount' | 'purchaserId' | 'reason'> & {
    recipientPhoneNumber: string;
};

export interface DepositDTO {
  userId: string;
  compostReport: {
    depositWeight: number;
    binStatus?: 'empty' | 'full';
    compostSmell?: 'yes' | 'no';
    dryMatter?: DRYMATTERPRESENT,
    notes?: string;
    compostStand: CompostStandName
  }
}

export interface TransactionWithUsers extends Transaction {
  users: User[]
}