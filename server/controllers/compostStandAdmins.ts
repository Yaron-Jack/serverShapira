import { Request, Response } from "express";
import { prisma } from "..";
import { AddCompostStandAdminReq, CompostStandAdminsReq } from "../../types/compostStand";

export async function setCompostStandAdmins(req: Request<CompostStandAdminsReq>, res: Response) {
    const { userIds, compostStandId } = req.body;
    try {
        const updatedStand = await prisma.compostStand.update({
            where: {
                compostStandId: compostStandId
            },
            data: {
                admins: {
                    connect: userIds.map((id: string) => ({ id }))
                }
            },
            include: {
                admins: true
            }
        });

        res.status(201).send(updatedStand);
    } catch (e) {
        console.log(e);
        res.send(400);
    }
}

export async function addCompostStandAdmin(req: Request<AddCompostStandAdminReq>, res: Response) {
    const { userId: id, compostStandId } = req.body;
    try {
        const compostStand = await prisma.compostStand.findUnique({
            where: {
                compostStandId: compostStandId,
            },
            include: {
                admins: true,
            },
        });

        if (!compostStand) {
            throw new Error('CompostStand not found');
        }

        const existingAdminIds = compostStand.admins.map((admin) => ({ id: admin.id }));

        const updatedStand = await prisma.compostStand.update({
            where: {
                compostStandId: compostStandId,
            },
            data: {
                admins: {
                    connect: [...existingAdminIds, { id }]
                },
            },
            include: {
                admins: true
            }
        });
        res.status(201).send(updatedStand);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}

export async function removeCompostAdmins(req: Request<CompostStandAdminsReq>, res: Response) {
    const { compostStandId, userIds } = req.body;
    try {
        const compostStand = await prisma.compostStand.findUnique({
            where: {
                compostStandId: compostStandId,
            },
            include: {
                admins: true,
            },
        });

        if (!compostStand) {
            throw new Error('CompostStand not found');
        }

        const adminIdsToRemove = userIds.filter((userId: string) =>
            compostStand.admins.some((admin) => admin.id === userId)
        );

        if (adminIdsToRemove.length === 0) {
            throw new Error('provided ids are not admins of provided compost stand');
        }

        const updatedCompostStand = await prisma.compostStand.update({
            where: {
                compostStandId: compostStandId,
            },
            data: {
                admins: {
                    disconnect: adminIdsToRemove.map((userId: string) => ({ id: userId })),
                },
            },
            include: {
                admins: true
            }
        });

        res.status(201).send(updatedCompostStand);
    } catch (e) {
        console.error('Error removing admins from CompostStand:', e);
        res.status(400).send(e)
    }
}

export async function getAllCompostStandAdmins(_req: Request, res: Response) {
    try {
        const allCompostStandsWithAdmins = await prisma.compostStand.findMany({
            include: {
                admins: true,
            },
        });

        const allAdmins = allCompostStandsWithAdmins.flatMap((stand) => stand.admins || []);
        res.status(200).send(allAdmins);
    } catch (error) {
        console.error('Error retrieving all CompostStand admins:', error);
        res.status(400).send(error)
    }
}