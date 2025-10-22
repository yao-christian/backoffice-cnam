import {
  HttpError,
  NotFoundError,
  UserNotAuthenticatedError,
} from "@/utils/errors";

import { customFetch } from "@/components/utils/custom-fetch";
import { ApiResponse } from "@/types/api";

import {
  ApiClaimPaginationSchema,
  ClaimsListSchema,
} from "./schemas/api.schemas";

import { Claim } from "./claim.type";
import { formatPaginatedData } from "@/components/utils/pagination";
import { ApiPaginationSchema } from "@/utils/api-utils";

export async function getClaimsWithPagination({ page = 0, perPage = 10 }) {
  const apiPage = page + 1;
  const url = `${process.env.API_URL}/api/claim/list?page=${apiPage}&limit=${perPage}`;

  try {
    const response = await customFetch(url, { isAuth: true });

    if (!response.ok) {
      if (response.status === 401) throw new UserNotAuthenticatedError();
      if (response.status === 404)
        throw new NotFoundError("Liste des réclamations introuvable.");

      throw HttpError.fromResponse(response);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new HttpError(
        "Réponse invalide du serveur (format non JSON).",
        502,
        "HTTP_ERROR",
      );
    }

    const responseData: ApiResponse<unknown> = await response.json();

    if (responseData.status !== "success") {
      throw new HttpError(
        responseData.message ||
          "Impossible de récupérer les réclamations. Veuillez réessayer plus tard.",
        422,
        "APPLICATION_ERROR",
      );
    }

    const parsedResponseData = ApiClaimPaginationSchema.parse(
      responseData.data,
    );

    const Claims = ClaimsListSchema.parse(parsedResponseData.data);

    const totalCount = parsedResponseData.total;
    const totalPages = parsedResponseData.lastPage;

    return formatPaginatedData<Claim>({
      totalCount,
      totalPages,
      page,
      perPage: parsedResponseData.perPage,
      data: Claims,
    });
  } catch (error: any) {
    console.error("Erreur dans getClaimsWithPagination:", error);

    if (error instanceof HttpError) throw error;

    throw new HttpError("Erreur inattendue du client.", 500, "HTTP_ERROR", {
      cause: error,
    });
  }
}
