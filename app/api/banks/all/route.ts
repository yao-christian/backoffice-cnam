export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.bank.findMany();

    return Response.json({ data });
  } catch (error) {
    throw error;
  }
}
