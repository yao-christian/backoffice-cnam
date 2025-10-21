import { prisma } from "@/lib/prisma";
import type { SellerDashboard } from "./dashboard.type";
import { resolveRange } from "./range";

export async function getSellerDashboard(
  userId: string,
  range?: { from?: Date | string; to?: Date | string },
): Promise<SellerDashboard> {
  const { from, to } = resolveRange(range);

  const account = await prisma.sellerAccount.findUnique({
    where: { sellerId: userId },
    select: { id: true, balance: true },
  });

  if (!account) {
    throw new Error("Compte vendeur introuvable");
  }

  const [agg, recentSales, topServices] = await Promise.all([
    prisma.sale.aggregate({
      _sum: { amount: true },
      _count: { _all: true },
      where: { sellerId: userId, createdAt: { gte: from, lte: to } },
    }),
    prisma.sale.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { service: true },
    }),
    prisma.sale.groupBy({
      by: ["serviceId"],
      _sum: { amount: true },
      _count: { _all: true },
      where: { sellerId: userId, createdAt: { gte: from, lte: to } },
      orderBy: { _sum: { amount: "desc" } },
      take: 5,
    }),
  ]);

  // Timeseries par jour (Postgres)
  const series = await prisma.$queryRaw<{ day: Date; total: number }[]>`
    SELECT DATE_TRUNC('day', "created_at") AS day, SUM(amount)::float AS total
    FROM "sale"
    WHERE "seller_id" = ${userId} AND "created_at" BETWEEN ${from} AND ${to}
    GROUP BY 1 ORDER BY 1
  `;

  return {
    profile: "SELLER",
    balance: account.balance,
    totalAmount: agg._sum.amount ?? 0,
    salesCount: agg._count._all,
    recentSales: recentSales.map((s) => ({
      id: s.id,
      ref: s.refTransaction,
      service: s.service.name,
      qty: s.quantity,
      amount: s.amount,
      date: s.createdAt,
    })),
    topServices,
    timeseries: series.map((p) => ({
      day: p.day.toISOString().slice(0, 10),
      total: p.total ?? 0,
    })),
    period: { from, to },
  };
}
