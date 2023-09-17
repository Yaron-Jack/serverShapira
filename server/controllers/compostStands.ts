import { Request, Response } from "express";
import { compostStandReqObject } from "../../types/compostStand";
import { prisma } from "..";

type RequestBody<T> = Request<{}, {}, T>;


export const addCompostStand = async (req: RequestBody<compostStandReqObject>, res: Response) => {
  const { CompostStandId, name } = req.body;
  try {
    const stand = await prisma.compostStand.create({
      data: {
        CompostStandId, name
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
