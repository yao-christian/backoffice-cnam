export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { BaseError, HttpError, ValidationError } from "@/utils/errors";

import { jsonError } from "@/utils/next-api-utils";
import { getRoleDetails } from "@/features/role/role-details.service";

export async function GET(request: NextRequest) {
  // 1) Parse et valide les query params
  const searchParams = request.nextUrl.searchParams;
  const uuidParam = searchParams.get("uuid");

  if (!uuidParam) {
    return jsonError("Paramètre 'uuid' requis.", 400);
  }

  try {
    // 2) Appel role (peut jeter HttpError / ValidationError)
    const data = await getRoleDetails(uuidParam);

    // 3) Réponse succès
    return NextResponse.json(
      { status: "success", message: "Détails du role", data },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("GET /api/roles error:", error);

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
