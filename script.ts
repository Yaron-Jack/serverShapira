import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany();
  const users = await prisma.user.createMany({
    data: [
      {
        name: 'kyle',
        email: 'kyle@test.com',
        age: 27,
      },
      {
        name: 'sally',
        email: 'sally@test.com',
        age: 23,
      }
    ]
  })
  console.log(users);
  const user = await prisma.user.findUnique({
    where: {
      email: 'kyle'
    }
  });
  console.log(user)
}

main()
  .catch(e => {
    console.log(e.message)
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
