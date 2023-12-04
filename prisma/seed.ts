import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
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
