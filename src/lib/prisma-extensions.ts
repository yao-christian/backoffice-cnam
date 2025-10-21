// src/lib/prisma-extensions.ts

/*import { PrismaClient } from "@prisma/client";
import { shallowDiff, writeAudit } from "@/features/audit/audit.service";

export const prisma = new PrismaClient().$extends({
  query: {
    sale: {
      async create({ args, query }) {
        const res = await query(args);
        await writeAudit(prisma, {
          entity: "sale",
          entityId: res.id,
          action: "CREATE",
          changes: {
            after: { id: res.id, amount: res.amount, quantity: res.quantity },
          },
          description: `SALE CREATE ref=${res.refTransaction} amount=${res.amount}`,
        }).catch(() => {});
        return res;
      },
      async update({ args, query }) {
        const before = await prisma.sale.findUnique({
          where: (args as any).where,
        });
        const res = await query(args);
        await writeAudit(prisma, {
          entity: "sale",
          entityId: res.id,
          action: "UPDATE",
          changes: { before, after: res, diff: shallowDiff(before, res) },
          description: `SALE UPDATE id=${res.id}`,
        }).catch(() => {});
        return res;
      },
    },
  },
});
*/
