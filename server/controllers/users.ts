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



export const saveNewUser = async (req: RequestBody<userReqObject>) => {
  const { firstName, lastName, phoneNumber } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        phoneNumber,
        firstName,
        lastName,
      },
    });
    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getUser = async (req: RequestBody<userReqObject>, res: Response) => {
  const { phoneNumber } = req.body;
  try {
    let user = await prisma.user.findUnique({
      where: {
        phoneNumber: phoneNumber
      }
    });
    if (!user) {
      user = await saveNewUser(req);
    }

    res.status(200).send(user);
  } catch (e) {
    res.status(400);
  }
}

export const deleteAllusers = async (_req: Request, res: Response) => {
  const { count } = await prisma.user.deleteMany();
  res.send(count)
}
