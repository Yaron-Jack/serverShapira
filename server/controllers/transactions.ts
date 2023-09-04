import { Request, Response } from "express";
import { prisma } from "..";
import { TransactionDTO } from "../../types/transactionTypes";

type RequestBody<T> = Request<{}, {}, T>;

export const findUserIdByPhoneNumber = async (phoneNumber: string): Promise<string> => {
  try {

    const user = await prisma.user.findUnique({ where: { phoneNumber: phoneNumber } });
    if (!user) {
      throw new Error('User not found');
    }
    return user.id;
  } catch (error: any) {
    throw new Error(error);
  }
}

export const getAllTransactions = async (_req: Request, res: Response) => {
  const transactions = await prisma.transaction.findMany();
  res.json(transactions);
};


export const saveNewTransaction = async (req: RequestBody<TransactionDTO>, res: Response) => {
  const transaction = req.body;
  try {
    const recipientId = await findUserIdByPhoneNumber(transaction.recipientPhoneNumber);

  // TODO check balance is adequate for transaction
    const transactionDBResponse = await prisma.transaction.create({
      data: {
        category: transaction.category,
        amount: transaction.amount,
        purchaserId: transaction.purchaserId,
        reason: transaction.reason,
        recipientId,
        users: {
          connect: [{ id: recipientId }, { id: transaction.purchaserId }],
        },
      },
    })

    await prisma.user.update({
      where: {
        id: recipientId
      },
      data: { accountBalance: { increment: transaction.amount } },
    })

    await prisma.user.update({
      where: {
        id: transaction.purchaserId
      },
      data: { accountBalance: { decrement: transaction.amount } },
    })

    res.status(201).json(transactionDBResponse);
  } catch (e: any) {
    console.log(e)
    res.status(400).json({ error: e.message })
  }

}
