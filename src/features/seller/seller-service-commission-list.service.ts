import { CustomError } from "@/utils/errors";
import { prisma } from "@/lib/prisma";
import { USER_ROLES } from "@/features/user/user.constant";
import { SELLER_SERVICE_COMMISSION_SELECT } from "./seller.type";
import { getAuthSession } from "@/lib/auth/auth-session";

export async function getSellerServiceCommissions(sellerAccountId: string) {
  const session = await getAuthSession();

  if (!session?.user?.email) {
    throw new CustomError("Erreur lors de la liste des commissions");
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

    const commissions = prisma.sellerServiceCommission.findMany({
      where: { sellerId: sellerAccountId },
      select: SELLER_SERVICE_COMMISSION_SELECT,
    });

    return commissions;
  } catch (error) {
    console.log(error);
    throw Error("Erreur lors de la liste des commissions");
  }
}
