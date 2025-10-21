import { PrismaClient } from "@prisma/client";
// import { registerAuditMiddleware } from "@/lib/prisma-audit-middleware";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// if (typeof window === "undefined" && process.env.NEXT_RUNTIME !== "edge") {
//   // registerAuditMiddleware({ softFail: true });
// }
