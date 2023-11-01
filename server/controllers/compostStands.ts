import { Request, Response } from "express";
import { compostStandReqObject } from "../../types/compostStand";
import { prisma } from "..";

type RequestBody<T> = Request<{}, {}, T>;

export const addCompostStand = async (req: RequestBody<compostStandReqObject>, res: Response) => {
  const { compostStandId, name } = req.body;
  try {
    const stand = await prisma.compostStand.create({
      data: {
        CompostStandId: compostStandId,
        name
      }
    });
    res.status(200).send(stand);
  } catch (e) {
    res.status(400);
    console.log(e);
  }
}

export const getCompostStands = async (_req: Request, res: Response) => {
  try {
    const stands = await prisma.compostStand.findMany({
      include: {
        Reports: true
      }
    });
    res.status(200).send(stands);
  } catch (e) {
    console.log(e);
    res.send(400)
  }
}

interface addUsersLocalStandReqObject {
  compostStandId: number;
  userId: string;
}

export async function setUsersLocalStand(req: RequestBody<addUsersLocalStandReqObject>, res: Response) {
  const { compostStandId, userId } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        userLocalCompostStandId: compostStandId
      }
    })
    res.status(201).send(updatedUser);
  } catch (e) {
    console.log(e);
    res.send(400)
  }
}
