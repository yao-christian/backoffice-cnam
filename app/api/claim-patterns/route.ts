export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { BaseError, HttpError, ValidationError } from "@/utils/errors";

import { jsonError } from "@/utils/next-api-utils";
import { getClaimPatternsWithPagination } from "@/features/claim-pattern/claim-pattern-list.service";

export async function GET(request: NextRequest) {
  // 1) Parse et valide les query params
  const searchParams = request.nextUrl.searchParams;
  const pageParam = searchParams.get("page");
  const perPageParam = searchParams.get("perPage");

  // Valeurs par défaut si non fournis
  const page = pageParam ? Number(pageParam) : 0;
  const perPage = perPageParam ? Number(perPageParam) : 10;

  if (Number.isNaN(page) || page < 0) {
    return jsonError("Paramètre 'page' invalide (entier >= 0 requis).", 400);
  }

  if (Number.isNaN(perPage) || perPage <= 0) {
    return jsonError("Paramètre 'perPage' invalide (entier > 0 requis).", 400);
  }

  try {
    // 2) Appel Claim (peut jeter HttpError / ValidationError)
    const data = await getClaimPatternsWithPagination({ page, perPage });

    // 3) Réponse succès
    return NextResponse.json(
      { status: "success", message: "Liste des motifs", data },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("GET /api/claim-patterns error:", error);

    // 4) Erreurs applicatives déjà normalisées en HttpError
    if (error instanceof ValidationError) {
      // si tu stockes les détails dans error.cause:
      return jsonError(
        error.message || "Erreur de validation.",
        error.statusCode ?? 422,
        { kind: error.kind, errors: (error as any).cause ?? undefined },
      );
    }

    if (error instanceof HttpError) {
      return jsonError(error.message, error.statusCode, { kind: error.kind });
    }

    // 5) Autres erreurs connues (non HTTP) — BaseError
    if (error instanceof BaseError) {
      const status = error.statusCode ?? 500;
      return jsonError(error.message || "Erreur interne.", status, {
        kind: error.kind,
      });
    }

    // 6) Inconnu → 500 générique
    return jsonError(
      "Erreur interne du serveur. Veuillez réessayer plus tard.",
      500,
    );
  }
}
