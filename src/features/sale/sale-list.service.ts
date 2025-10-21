import { CustomError } from "@/utils/errors";
import { formatPaginatedData } from "@/components/utils/pagination";
import { prisma } from "@/lib/prisma";
import { USER_ROLES } from "@/features/user/user.constant";
import { SALE_SELECT } from "./sale.type";
import { getAuthSession } from "@/lib/auth/auth-session";

export async function getSalesWithPagination({ page = 0, perPage = 10 }) {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    throw new CustomError("Erreur lors de la récupération des ventes");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: { select: { code: true } } },
    });

    if (
      !user ||
      ![
        USER_ROLES.superAdmin.code,
        USER_ROLES.admin.code,
        USER_ROLES.seller.code,
      ].includes(user.role.code)
    ) {
      throw new CustomError("Aucune permission");
    }

    if (
      [USER_ROLES.superAdmin.code, USER_ROLES.admin.code].includes(
        user.role.code,
      )
    ) {
      // Exécution des requêtes en parallèle avec prisma.$transaction
      const [sales, totalCount] = await prisma.$transaction([
        prisma.sale.findMany({
          skip: page * perPage,
          take: perPage,
          orderBy: { createdAt: "desc" },
          select: SALE_SELECT,
        }),
        prisma.sale.count(),
      ]);

      return formatPaginatedData({
        totalCount,
        totalPages: Math.ceil(totalCount / perPage),
        page,
        perPage,
        data: sales,
      });
    }

    if ([USER_ROLES.seller.code].includes(user.role.code)) {
      // Exécution des requêtes en parallèle avec prisma.$transaction
      const [sales, totalCount] = await prisma.$transaction([
        prisma.sale.findMany({
          where: { seller: { id: session.user.id } },
          skip: page * perPage,
          take: perPage,
          orderBy: { createdAt: "desc" },
          select: SALE_SELECT,
        }),
        prisma.sale.count(),
      ]);

      return formatPaginatedData({
        totalCount,
        totalPages: Math.ceil(totalCount / perPage),
        page,
        perPage,
        data: sales,
      });
    }

    throw new CustomError("Aucune permission");
  } catch (error) {
    console.log(error);
    throw Error("Erreur lors de la récupération des ventes");
  }
}
