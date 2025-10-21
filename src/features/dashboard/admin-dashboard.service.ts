import { prisma } from "@/lib/prisma";
import type { AdminDashboard } from "./dashboard.type";
import { resolveRange } from "./range";

export async function getAdminDashboard(range?: {
  from?: Date | string;
  to?: Date | string;
}): Promise<AdminDashboard> {
  const { from, to } = resolveRange(range);

  const [agg, topSellers, topServices, recentSales, deposits] =
    await Promise.all([
      prisma.sale.aggregate({
        _sum: { amount: true },
        _count: { _all: true },
        where: { createdAt: { gte: from, lte: to } },
      }),
      prisma.sale.groupBy({
        by: ["sellerId"],
        _sum: { amount: true },
        _count: { _all: true },
        where: { createdAt: { gte: from, lte: to } },
        orderBy: { _sum: { amount: "desc" } },
        take: 5,
      }),
      prisma.sale.groupBy({
        by: ["serviceId"],
        _sum: { amount: true },
        _count: { _all: true },
        where: { createdAt: { gte: from, lte: to } },
        orderBy: { _sum: { amount: "desc" } },
        take: 5,
      }),
      prisma.sale.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { service: true, seller: true },
      }),
      prisma.sellerDeposit.findMany({
        orderBy: { depositDate: "desc" },
        take: 5,
        include: { sellerAccount: { include: { seller: true } }, bank: true },
      }),
    ]);

  const series = await prisma.$queryRaw<{ day: Date; total: number }[]>`
    SELECT DATE_TRUNC('day', "created_at") AS day, SUM(amount)::float AS total
    FROM "sale"
    WHERE "created_at" BETWEEN ${from} AND ${to}
    GROUP BY 1 ORDER BY 1
  `;

  return {
    profile: "ADMIN",
    totalAmount: agg._sum.amount ?? 0,
    salesCount: agg._count._all,
    topSellers,
    topServices,
    recentSales: recentSales.map((s) => ({
      id: s.id,
      ref: s.refTransaction,
      seller: s.seller.firstName ?? s.seller.email,
      service: s.service.name,
      amount: s.amount,
      date: s.createdAt,
    })),
    depositsPending: deposits.map((d) => ({
      id: d.id,
      amount: d.amount,
      depositDate: d.depositDate,
      seller: d.sellerAccount.seller.firstName ?? d.sellerAccount.seller.email,
      bank: d.bank.name,
    })),
    timeseries: series.map((p) => ({
      day: p.day.toISOString().slice(0, 10),
      total: p.total ?? 0,
    })),
    period: { from, to },
  };
}
