export const dynamic = "force-dynamic";

import { CustomError } from "@/utils/errors";
import { getAuditsWithPagination } from "@/features/audit/audit-list.service";

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  const perPage = searchParams.get("perPage");

  try {
    const data = await getAuditsWithPagination({
      page: Number(page),
      perPage: perPage ? Number(perPage) : undefined,
    });
    return Response.json({ data });
  } catch (error) {
    console.error("Get audits error", error);
    throw new CustomError("Erreur lors de la récupération des audits");
  }
}
