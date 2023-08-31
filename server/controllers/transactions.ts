import { Request, Response } from "express";
import { prisma } from "..";
import { TransactionDTO } from "../../types/transactionTypes";

type RequestBody<T> = Request<{}, {}, T>;

export const getAllTransactions = async (_req: Request, res: Response) => {
  const transactions = await prisma.transaction.findMany();
  res.json(transactions);
};


export const saveNewTransaction = async (req: RequestBody<TransactionDTO>, res: Response) => {
  const transaction = req.body
  const result = await prisma.transaction.create({
    data: {
      ...transaction,
      users: {
        connect: [{ id: transaction.recipientId }, { id: transaction.purchaserId }],
      },
    },
  })
  res.json(result)
}
