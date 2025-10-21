import { CustomError } from "@/utils/errors";
import { formatPaginatedData } from "@/components/utils/pagination";
import { prisma } from "@/lib/prisma";
import { USER_ROLES } from "@/features/user/user.constant";
import { AUDIT_LOG_SELECT } from "./audit.type";
import { getAuthSession } from "@/lib/auth/auth-session";

export async function getAuditsWithPagination({ page = 0, perPage = 10 }) {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    throw new CustomError("Erreur lors de la récupération Journal d'audit");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: { select: { code: true } } },
    });

    if (
      user &&
      [USER_ROLES.superAdmin.code, USER_ROLES.admin.code].includes(
        user.role.code,
      )
    ) {
      // Exécution des requêtes en parallèle avec prisma.$transaction
      const [audits, totalCount] = await prisma.$transaction([
        prisma.auditLog.findMany({
          skip: page * perPage,
          take: perPage,
          orderBy: { timestamp: "desc" },
          select: AUDIT_LOG_SELECT,
        }),
        prisma.auditLog.count(),
      ]);

      return formatPaginatedData({
        totalCount,
        totalPages: Math.ceil(totalCount / perPage),
        page,
        perPage,
        data: audits,
      });
    }

    throw new CustomError("Aucune permission");
  } catch (error) {
    console.log(error);
    throw Error("Erreur lors de la récupération du Journal d'audit");
  }
}
