import { CompostStand, PrismaClient } from '@prisma/client'
import { standsIdToNameMap } from '../constants/compostStands';
const prisma = new PrismaClient()
async function main() {
    try {
        const compostStands: CompostStand[] = Object.entries(standsIdToNameMap).map(([key, val]) => ({
            name: val,
            compostStandId: parseInt(key)
        }))
        await prisma.compostStand.createMany({
            data: compostStands
        });

        const liraShapira = await prisma.user.upsert({
            where: {
                id: process.env.LIRA_SHAPIRA_USER_ID
            },
            update: {},
            create: {
                lastName: 'SHAPIRA',
                firstName: 'LIRA',
                phoneNumber: '000'
            },
        })
        console.log('LIRA_SHAPIRA_USER_ID: ', liraShapira.id )
    } catch (e) {
        console.log(e)
    }


}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
