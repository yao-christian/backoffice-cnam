export const dynamic = "force-dynamic";

import { SELLER_SELECT } from "@/features/seller/seller.type";
import { USER_ROLES } from "@/features/user/user.constant";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.user.findMany({
      where: { role: { code: USER_ROLES.seller.code } },
      select: SELLER_SELECT,
    });

    return Response.json({ data });
  } catch (error) {
    throw error;
  }
}
