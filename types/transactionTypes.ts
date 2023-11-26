import { DRYMATTERPRESENT, Transaction, User } from "@prisma/client";
import { CompostStandName } from "../constants/compostStands";

export type TransactionDTO = Pick<Transaction, 'category' | 'amount' | 'purchaserId' | 'reason'> & {
    recipientPhoneNumber: string;
};

export interface DepositDTO {
  userId: string;
  compostReport: {
    depositWeight: number;
    dryMatter?: DRYMATTERPRESENT,
    notes?: string;
    compostStand: CompostStandName
    bugs?: boolean;             
    scalesProblem?: boolean;    
    full?: boolean;             
    cleanAndTidy?: boolean;  
    // TODO yes/no is legacy
    compostSmell?: 'yes' | 'no' | boolean;
  }
}

export interface TransactionWithUsers extends Transaction {
  users: User[]
}