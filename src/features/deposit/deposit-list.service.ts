import { CustomError } from "@/utils/errors";
import { formatPaginatedData } from "@/components/utils/pagination";
import { prisma } from "@/lib/prisma";
import { USER_ROLES } from "@/features/user/user.constant";
import { DEPOSIT_SELECT } from "./deposit.type";
import { getAuthSession } from "@/lib/auth/auth-session";

export async function getDepositsWithPagination({ page = 0, perPage = 10 }) {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    throw new CustomError("Erreur lors de la récupération des deposits");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: { select: { code: true } } },
    });

    if (
      !user ||
      ![USER_ROLES.superAdmin.code, USER_ROLES.admin.code].includes(
        user.role.code,
      )
    ) {
      throw new CustomError("Aucune permission");
    }

    // Exécution des requêtes en parallèle avec prisma.$transaction
    const [deposits, totalCount] = await prisma.$transaction([
      prisma.sellerDeposit.findMany({
        skip: page * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
        select: DEPOSIT_SELECT,
      }),
      prisma.sellerDeposit.count(),
    ]);

    return formatPaginatedData({
      totalCount,
      totalPages: Math.ceil(totalCount / perPage),
      page,
      perPage,
      data: deposits,
    });
  } catch (error) {
    console.log(error);
    throw Error("Erreur lors de la récupération des deposits");
  }
}
