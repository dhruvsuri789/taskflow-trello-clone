import { PrismaClient } from "@prisma/client";

// Global prisma client
declare global {
  var prisma: PrismaClient | undefined;
}

// This way we will only create one instance and not create one for every request
// Like a singleton pattern
// Global is excluded from hot reload
export const prismaClient = globalThis.prisma || new PrismaClient();

// We are in the development mode, so we will set the prisma client to the global object
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaClient;

// If we do simply this way, it will create a new instance every time we call it
// NextJs does hot reload, so it will create a new instance every time and that will create a warnig inside your project
// const prisma = new PrismaClient()
