import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      email: 'gil@gmail.com',
      firstName: 'gil',
      lastName: 'reich',
    },
  });

  const users = await prisma.user.findMany();
  console.log(users)
}


main()
  .catch(e => {
    console.log(e.message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
