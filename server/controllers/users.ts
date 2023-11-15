import { Request, Response } from 'express';
import { phoneNumberReqObject, userReqObject } from '../../types/userTypes';
import { prisma } from '../index';
import { Category } from '@prisma/client';
import { ErrorRes } from '../../types/commonTypes';
import { convertUserWithTransactionsCountToCountArray, findUserIdByPhoneNumber } from '../utils';

type RequestBody<T> = Request<{}, {}, T>;

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    include: {
      transactions: true
    }
  });
  res.json(users);
};

export const saveNewUser = async (req: RequestBody<userReqObject>, res: Response) => {
  const { firstName, lastName, phoneNumber, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        phoneNumber,
        firstName,
        lastName,
        ...(email && { email })
      },
      include: {
        transactions: true
      }
    });
    res.status(200).send(user);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const getUser = async (req: RequestBody<userReqObject>, res: Response) => {
  const { phoneNumber } = req.body;
  try {
    let user = await prisma.user.findUnique({
      where: {
        phoneNumber: phoneNumber
      },
      include: {
        transactions: true
      }
    });
    if (!user) {
      throw new Error('User not found');
    }
    res.status(200).send(user);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

interface userStatsRes {
  userCount: number;
  newUserCount: number;
  transactionsPerUser: number[];
  averageTransactionsPerUser: number;
  depositsPerUser: number[];
  period: number;
}

export const userStats = async (req: Request<{ period?: string }>, res: Response<userStatsRes | ErrorRes>) => {
  let period = 30
  if (req.query.period && typeof req.query.period === 'string') {
    period = parseInt(req.query.period);
  }
   
  const today = new Date();
  const rangeDate = new Date(new Date().setDate(new Date().getDate() - period));
  const dateQuery ={
      lte: today,
      gte: rangeDate
  }
  
  try {
    const userCount = await prisma.user.count();
    
    const newUserCount = await prisma.user.count({
      where: {
        createdAt: dateQuery
      },
    });

    const usersWithTransactionsCount = await prisma.user.findMany({
      select: {
        _count: {
          select: { transactions: true },
        },
      },
      where: { 
        NOT: {
          id: process.env.LIRA_SHAPIRA_USER_ID
        }
       },
    });
    const transactionsPerUser = convertUserWithTransactionsCountToCountArray(usersWithTransactionsCount);
    const averageTransactionsPerUser = transactionsPerUser.reduce((a, b) => a + b) / transactionsPerUser.length;
    const usersWithDepositCount = await prisma.user.findMany({
      select: {
        _count: {
          select: {
            transactions: { where: { category: Category.DEPOSIT } },
          },
        },
      },
      where: { 
        NOT: {
          id: process.env.LIRA_SHAPIRA_USER_ID
        }
       },
    });

    const depositsPerUser = convertUserWithTransactionsCountToCountArray(usersWithDepositCount);

    // max age of 12 hours
    res.header("Cache-Control", "max-age=43200");
    res.status(200).send({
      userCount,
      transactionsPerUser,
      averageTransactionsPerUser,
      depositsPerUser,
      newUserCount,
      period
    });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
};

export const deleteAllusers = async (_req: Request, res: Response) => {
  const { count } = await prisma.user.deleteMany();
  res.send(count)
}
