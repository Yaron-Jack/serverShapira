import { Request, Response } from "express";
import { prisma } from "..";
import { TransactionDTO } from "../../types/transactionTypes";

type RequestBody<T> = Request<{}, {}, T>;

export const getAllTransactions = async (_req: Request, res: Response) => {
  const transactions = await prisma.transaction.findMany();
  res.json(transactions);
};


export const saveNewTransaction = async (req: RequestBody<TransactionDTO>, res: Response) => {
  const transaction = req.body;
  // TODO check balance is adequate for transaction
  try {
    const result = await prisma.transaction.create({
      data: {
        ...transaction,
        users: {
          connect: [{ id: transaction.recipientId }, { id: transaction.purchaserId }],
        },
      },
    })

    await prisma.user.update({
      where: {
        id: transaction.recipientId
      },
      data: { accountBalance: { increment: transaction.amount } },
    })

    await prisma.user.update({
      where: {
        id: transaction.purchaserId
      },
      data: { accountBalance: { decrement: transaction.amount } },
    })

    res.json(result)
  } catch (e) {
    console.log(e)
  }

}
