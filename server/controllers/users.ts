import { Request, Response } from 'express';
import { userReqObject } from '../../types/userTypes';
import { prisma } from '../index';

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
}

export const deleteAllusers = async (_req: Request, res: Response) => {
  const { count } = await prisma.user.deleteMany();
  res.send(count)
}
