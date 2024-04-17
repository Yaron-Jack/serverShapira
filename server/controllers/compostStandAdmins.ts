import { Request, Response } from "express";
import { prisma } from "..";
import { CompostStandAdminsReq } from "../../types/compostStand";

export async function addCompostStandAdmin(req: Request<CompostStandAdminsReq>, res: Response) {
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
        });
        res.status(201).send(updatedStand);
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}

export async function removeCompostStandAdmin(req: Request<CompostStandAdminsReq>, res: Response) {
    const { compostStandId, userId } = req.body;
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

        const isAdmin = compostStand.admins.some((admin) => admin.id === userId)


        if (!isAdmin) {
            throw new Error('provided id not admins of provided compost stand');
        }

        const updatedCompostStand = await prisma.compostStand.update({
            where: {
                compostStandId: compostStandId,
            },
            data: {
                admins: {
                    disconnect: [{ id: userId }]
                },
            },
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
