import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const adapter = new PrismaLibSQL(libsql);

// Global prisma client
declare global {
  var prisma: PrismaClient | undefined;
}

// This way we will only create one instance and not create one for every request
// Like a singleton pattern
// Global is excluded from hot reload
export const prismaClient = globalThis.prisma || new PrismaClient({ adapter });

// We are in the development mode, so we will set the prisma client to the global object
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaClient;
