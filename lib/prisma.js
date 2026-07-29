import { PrismaClient } from "@prisma/client";

// Next.js reloads code a lot in development, which would normally create a
// new database connection every time. We stash the client on `global` so
// the same one is reused instead of piling up new connections.
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
