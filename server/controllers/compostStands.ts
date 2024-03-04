import { Request, Response } from 'express';
import { compostStandReqObject } from '../../types/compostStand';
import { prisma } from '..';
import { standsIdToNameMap } from '../../constants/compostStands';
import { months } from '../utils';
import { Decimal } from '@prisma/client/runtime/library';

type RequestBody<T> = Request<{}, {}, T>;

export const addMultipleCompostStands = async (
  req: RequestBody<compostStandReqObject[]>,
  res: Response
) => {
  try {
    req.body.forEach(async (stand) => {
      await prisma.compostStand.create({
        data: {
          compostStandId: stand.compostStandId,
          name: stand.name,
        },
      });
    });
    res.status(200).send('ok');
  } catch (e) {
    res.status(400);
    console.log(e);
  }
};

export const addCompostStand = async (
  req: RequestBody<compostStandReqObject>,
  res: Response
) => {
  const { compostStandId, name } = req.body;
  try {
    const stand = await prisma.compostStand.create({
      data: {
        compostStandId: compostStandId,
        name,
      },
    });
    res.status(200).send(stand);
  } catch (e) {
    res.status(400);
    console.log(e);
  }
};

export const getCompostStands = async (_req: Request, res: Response) => {
  try {
    const stands = await prisma.compostStand.findMany({
      include: {
        reports: true,
      },
    });
    res.status(200).send(stands);
  } catch (e) {
    console.log(e);
    res.send(400);
  }
};

interface addUsersLocalStandReqObject {
  compostStandId: number;
  userId: string;
}

export async function setUsersLocalStand(
  req: RequestBody<addUsersLocalStandReqObject>,
  res: Response
) {
  const { compostStandId, userId } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        userLocalCompostStandId: compostStandId,
      },
    });
    res.status(201).send(updatedUser);
  } catch (e) {
    console.log(e);
    res.send(400);
  }
}

export async function deleteAllCompostStands(_req: Request, res: Response) {
  try {
    await prisma.compostStand.deleteMany();
    res.status(200).send('All compost stands deleted');
  } catch (e) {
    console.log(e);
    res.send(400);
  }
}

export async function deleteAllCompostReports(_req: Request, res: Response) {
  try {
    await prisma.compostReport.deleteMany();
    res.status(200).send('All compost reports deleted');
  } catch (e) {
    console.log(e);
    res.send(400);
  }
}

export const monthlyCompostStandStats = async (req: Request, res: Response) => {
  try {
    const allReports = await prisma.compostReport.findMany();
    const reportsByMonth: {
      [key: string]: {
        weight: Decimal;
        count: number;
        average?: number;
      };
    } = {};

    for (let i = 0; i < allReports.length; i++) {
      const report = allReports[i];
      const reportMonth = months[report.date.getMonth()];
      if (reportsByMonth[reportMonth]) {
        reportsByMonth[reportMonth] = {
          weight: reportsByMonth[reportMonth].weight.plus(report.depositWeight),
          count: reportsByMonth[reportMonth].count + 1,
        };
      } else {
        reportsByMonth[reportMonth] = {
          weight: report.depositWeight,
          count: 1,
        };
      }
    }
    Object.entries(reportsByMonth).forEach(([month, value] )=> {
      reportsByMonth[month].average = value.weight.div(value.count).toDecimalPlaces(1).toNumber();
    })

    res.status(200).send({ reportsByMonth })
  } catch (e: any) {
    res.send(400).json({ error: e.message });
  }
} 

export const compostStandStats = async (req: Request, res: Response) => {
  let period = 30;
  if (req.query.period && typeof req.query.period === 'string') {
    period = parseInt(req.query.period);
  }
  const dateQuery = {
    lte: new Date(),
    gte: new Date(new Date().setDate(new Date().getDate() - period)),
  };

  try {
    const groupStandsDepositWeights = await prisma.compostReport.groupBy({
      by: ['compostStandId'],
      _sum: {
        depositWeight: true,
      },
      where: {
        NOT: {
          userId: process.env.LIRA_SHAPIRA_USER_ID,
        },
        date: dateQuery,
      },
    });

    const depositsWeightsByStands = groupStandsDepositWeights.map((s) => {
      return {
        id: s.compostStandId.toString(),
        name: standsIdToNameMap[s.compostStandId],
        weight: s._sum.depositWeight ? s._sum.depositWeight.toNumber() : 0,
      };
    })
      .sort((compostStandA, compostStandB) => compostStandA.weight < compostStandB.weight ? 1 : -1)

    // max age of 12 hours
    res.header('Cache-Control', 'max-age=43200');
    res.status(200).send({ depositsWeightsByStands, period });
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
};
