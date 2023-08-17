import { Request, Response, Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { userReqObject } from '../types/userTypes';
const prisma = new PrismaClient()

type RequestBody<T> = Request<{}, {}, T>;

const router = Router();

router.get('/users', async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users)
})

router.post('/user', async (req: RequestBody<userReqObject>, res: Response) => {
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
})

router.delete('/users', async (_req, res) => {
  const { count } = await prisma.user.deleteMany();
  res.send(count)
})

export default router;
