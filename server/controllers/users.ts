import { Request, Response } from 'express';
import { userReqObject } from '../../types/userTypes';
import { prisma } from '../index';

type RequestBody<T> = Request<{}, {}, T>;

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};



export const saveNewUser = async (req: RequestBody<userReqObject>, res: Response) => {
  const { firstName, lastName, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
      },
    });
    res.status(200).send(user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
};

export const getUserById = async (req: RequestBody<{ id: string }>, res: Response) => {
  const { id } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    });
    res.status(200).send(user);
  } catch (e) {
    res.send(400);
  }
}

export const deleteAllusers = async (_req: Request, res: Response) => {
  const { count } = await prisma.user.deleteMany();
  res.send(count)
}
