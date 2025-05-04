const { PrismaClient } = require("@prisma/client");
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  await prisma.book.createMany({
    data: [{ title: "Book 1" }, { title: "Book 2" }],
  });

  await prisma.user.createMany({
    data: [
      {
        email: "admin@example.com",
        passwordHash: await hash("hashed123", 10),
        name: "Admin",
        role: "admin",
      },
      {
        email: "guest@example.com",
        passwordHash: await hash("hashed123", 10),
        name: "Guest",
        role: "user",
      },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
