export const dynamic = "force-dynamic";

import { CustomError } from "@/utils/errors";
import { createSale } from "@/features/sale/create-sale.service";

import {
  InsufficientFundsError,
  NotFoundError,
  UnavailableError,
} from "@/utils/errors";

import { getSalesWithPagination } from "@/features/sale/sale-list.service";
import { CreateSaleSchema } from "@/features/sale/schemas/create-sale-schema";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/components/utils/bcrypt";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  const perPage = searchParams.get("perPage");

  try {
    const data = await getSalesWithPagination({
      page: Number(page),
      perPage: perPage ? Number(perPage) : undefined,
    });
    return Response.json({ data });
  } catch (error) {
    console.error("Get sales error", error);
    throw new CustomError("Erreur lors de la récupération des ventes");
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const json = await request.json();
    const body = CreateSaleSchema.parse(json);

    const result = await createSale({ ...body, sellerId: user.sub });

    if (result.success) {
      return NextResponse.json(result, { status: 201 });
    }

    // (cas non utilisé ici car le use-case lance des erreurs)
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 400 },
    );
  } catch (error: any) {
    // Mapping précis des erreurs métier → bons codes HTTP
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { success: false, message: "Requête invalide" },
        { status: 400 },
      );
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 404 },
      );
    }

    if (error instanceof UnavailableError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    if (error instanceof InsufficientFundsError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: "Format JSON invalide" },
        { status: 400 },
      );
    }

    console.error("Erreur interne (POST /api/sales):", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
