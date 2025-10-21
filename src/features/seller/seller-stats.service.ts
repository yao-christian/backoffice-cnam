import { CustomError } from "@/utils/errors";
import { prisma } from "@/lib/prisma";
import { USER_ROLES } from "@/features/user/user.constant";
import { USER_STATUS } from "@/constants/status";
import { getAuthSession } from "@/lib/auth/auth-session";

export async function getSellersStats() {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    throw new CustomError("Erreur lors de la récupération des vendeurs");
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
    const [totalSellers, activatedSellers, disabledSellers] =
      await prisma.$transaction([
        prisma.user.count({
          where: { role: { code: USER_ROLES.seller.code } },
        }),
        prisma.user.count({
          where: {
            role: { code: USER_ROLES.seller.code },
            statusCode: USER_STATUS.active.code,
          },
        }),
        prisma.user.count({
          where: {
            role: { code: USER_ROLES.seller.code },
            statusCode: USER_STATUS.disable.code,
          },
        }),
      ]);

    return {
      totalSellers,
      activatedSellers,
      disabledSellers,
    };
  } catch (error) {
    console.log(error);
    throw Error("Erreur lors de la récupération des statistiques des vendeurs");
  }
}
