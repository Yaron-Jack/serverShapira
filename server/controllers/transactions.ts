import { Request, Response } from 'express';
import { prisma } from '..';
import {
  DepositDTO, HandleRequestDTO,
  TransactionDTO,
} from '../../types/transactionTypes';
import { Category, Transaction } from '@prisma/client';
import { convertdepositDTOToCompostReportData, findUserIdByPhoneNumber } from '../utils';
import { standsNameToIdMap } from '../../constants/compostStands';
import { Decimal } from '@prisma/client/runtime/library';

type RequestBody<T> = Request<{}, {}, T>;

export const getAllTransactions = async (_req: Request, res: Response<Transaction[]>) => {
  const transactions = await prisma.transaction.findMany();
  res.json(transactions);
};

/**
 * @summary Saves a new transaction
 * @description Returns { Transaction, users: [User] }
 */
export const saveNewTransaction = async (
  req: RequestBody<TransactionDTO>,
  res: Response
) => {
  const transaction = req.body;
  try {
    const recipientId = await findUserIdByPhoneNumber(
      transaction.recipientPhoneNumber
    );
    const transactionWithUsers =
      await prisma.transaction.create({
        data: {
          category: transaction.category,
          amount: transaction.amount,
          purchaserId: transaction.purchaserId,
          reason: transaction.reason,
          recipientId,
          isRequest: transaction.isRequest,
          users: {
            connect: [{ id: recipientId }, { id: transaction.purchaserId }],
          },
        },
        include: {
          users: {
            select: {
              firstName: true,
              lastName: true
            },
            where: {
              id: transaction.isRequest ? transaction.purchaserId : recipientId
            }
          },
        },
      });

    if (transaction.isRequest) {
      res.status(201).json(transactionWithUsers);
      return;
    }

    // TODO check balance is adequate for transaction
    await prisma.user.update({
      where: {
        id: recipientId,
      },
      data: { accountBalance: { increment: transaction.amount } },
    });

    await prisma.user.update({
      where: {
        id: transaction.purchaserId,
      },
      data: { accountBalance: { decrement: transaction.amount } },
    });

    res.status(201).json(transactionWithUsers);
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
};

export const saveDeposit = async (
  { body }: RequestBody<DepositDTO>,
  res: Response
) => {

  const netGained = body.compostReport.depositWeight * 0.9;
  const tenPercent = body.compostReport.depositWeight * 0.1;
  const compostStandId = standsNameToIdMap[body.compostReport.compostStand];

  try {
    if (!process.env.LIRA_SHAPIRA_USER_ID) {
      throw new Error('no lira shapira user id available');
    }
    const newTransaction = await prisma.transaction.create({
      data: {
        amount: body.compostReport.depositWeight,
        category: Category.DEPOSIT,
        purchaserId: process.env.LIRA_SHAPIRA_USER_ID,
        recipientId: body.userId,
        reason: 'Deposit',
        users: {
          connect: [
            { id: process.env.LIRA_SHAPIRA_USER_ID },
            { id: body.userId },
          ],
        },
      },
      include: {
        users: {
          select: {
            firstName: true,
            lastName: true
          },
          where: {
            id: process.env.LIRA_SHAPIRA_USER_ID
          }
        },
      },
    });

    const compostStandAdmins = await prisma.compostStand.findUnique({
      where: {
        compostStandId: compostStandId
      },
      select: {
        admins: true
      }
    });

    const numberOfAdmins = compostStandAdmins?.admins.length;
    if (numberOfAdmins) {
      const bonus = tenPercent / numberOfAdmins;
      compostStandAdmins.admins.forEach(async admin => {
        // update user balance
        await prisma.user.update({
          where: {
            id: admin.id,
          },
          data: { accountBalance: { increment: bonus } },
        });
      });
    }

    // update user balance
    await prisma.user.update({
      where: {
        id: body.userId,
      },
      data: { accountBalance: { increment: body.compostReport.depositWeight } },
    });


    // save report to stand and reports
    await prisma.compostReport.create({
      data: convertdepositDTOToCompostReportData(body)
    });

    res.status(201).send({ ...newTransaction, amount: new Decimal(netGained) });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

export const handleRequest = async (
  { body }: RequestBody<HandleRequestDTO>,
  res: Response
) => {
  const { transaction, isRequestAccepted } = body;
  const transactionId = body.transaction.id;
  let updatedTransaction: Transaction;
  try {
    if (isRequestAccepted) {
      updatedTransaction = await prisma.transaction.update({
        where: {
          id: transactionId
        },
        data: {
          isRequest: false
        }
      });

      await prisma.user.update({
        where: {
          id: transaction.recipientId,
        },
        data: { accountBalance: { increment: transaction.amount } },
      });

      await prisma.user.update({
        where: {
          id: transaction.purchaserId,
        },
        data: { accountBalance: { decrement: transaction.amount } },
      });
    } else {
      updatedTransaction = await prisma.transaction.delete({
        where: {
          id: transactionId
        }
      })
    }

    res.status(201).send({
      ...updatedTransaction,
      isRequest: false
    });
  } catch (e) {
    res.status(400).send(e)
  }
}

// export const monthlyTransactionsStats = async (req: Request, res: Response) => {
//   try {
//     const allReports = await prisma.compostReport.findMany();
//     const reportsByMonth: {
//       [key: string]: {
//         weight: Decimal;
//         count: number;
//         average?: number;
//       };
//     } = {};

//     for (let i = 0; i < allReports.length; i++) {
//       const report = allReports[i];
//       const reportMonth = months[report.date.getMonth()];
//       if (reportsByMonth[reportMonth]) {
//         reportsByMonth[reportMonth] = {
//           weight: reportsByMonth[reportMonth].weight.plus(report.depositWeight),
//           count: reportsByMonth[reportMonth].count + 1,
//         };
//       } else {
//         reportsByMonth[reportMonth] = {
//           weight: report.depositWeight,
//           count: 1,
//         };
//       }
//     }
//     Object.entries(reportsByMonth).forEach(([month, value] )=> {
//       reportsByMonth[month].average = value.weight.div(value.count).toDecimalPlaces(1).toNumber();
//     })

//     res.status(200).send({ reportsByMonth })
//   } catch (e: any) {
//     res.send(400).json({ error: e.message });
//   }
// }

export const transactionStats = async (req: Request, res: Response) => {
  let period = 30;
  if (req.query.period && typeof req.query.period === 'string') {
    period = parseInt(req.query.period);
  }

  const dateQuery = {
    lte: new Date(),
    // TODO make possible to set dynamically from query params
    gte: new Date(new Date().setDate(new Date().getDate() - period)),
  };

  try {
    // TODO amount per transaction spread
    // TODO average amount per transaction


    // TODO REMOVE
    const groupTransactions = await prisma.transaction.groupBy({
      by: ['category'],
      _sum: {
        amount: true,
      },
      where: {
        createdAt: dateQuery,
        isRequest: false
      }
    });

    const transactionAmountByCategory = groupTransactions.map(transaction => {
      return {
        category: transaction.category,
        amount: transaction._sum.amount
      }
    })

    res.status(200).send({ transactionAmountByCategory });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
};

