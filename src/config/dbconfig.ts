import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function main() {
   const user = await prisma.user.create({ data: {name: "Anita"}});
   console.log(user)
}

main()
   .catch(e => console.log(e.message))
   .finally(async() => {
      await prisma.$disconnect()
   })

