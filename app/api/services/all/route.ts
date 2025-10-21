export const dynamic = "force-dynamic";

import { SERVICE_SELECT } from "@/features/service/service.type";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.service.findMany({
      select: SERVICE_SELECT,
    });

    return Response.json({ data });
  } catch (error) {
    throw error;
  }
}
