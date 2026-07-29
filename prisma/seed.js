// Creates the demo login. Products come from scripts/import-catalog.js
// instead of being seeded here — run that separately to load the catalog.
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "buyer@example.com" },
    update: {},
    create: {
      email: "buyer@example.com",
      password: hashedPassword,
      budget: 1000,
    },
  });

  console.log("Seeded demo user.");
  console.log("Demo login: buyer@example.com / password123");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
