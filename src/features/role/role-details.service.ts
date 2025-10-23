import {
  HttpError,
  NotFoundError,
  UserNotAuthenticatedError,
} from "@/utils/errors";

import { customFetch } from "@/components/utils/custom-fetch";
import { ApiResponse } from "@/types/api";

import { RoleDetailsApiResponseSchema } from "./schemas/api-role-details.schema";

export async function getRoleDetails(uuid: string) {
  const url = `${process.env.API_URL}/api/role/permissions?uuid=${uuid}`;

  try {
    const response = await customFetch(url, { isAuth: true });

    if (!response.ok) {
      if (response.status === 401) throw new UserNotAuthenticatedError();
      if (response.status === 404)
        throw new NotFoundError("Détails introuvable.");

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
          "Impossible de récupérer les détails. Veuillez réessayer plus tard.",
        422,
        "APPLICATION_ERROR",
      );
    }

    const roleDetails = RoleDetailsApiResponseSchema.parse(responseData.data);

    return roleDetails;
  } catch (error: any) {
    console.error("Erreur dans getRolesWithPagination:", error);

    if (error instanceof HttpError) throw error;

    throw new HttpError("Erreur inattendue du client.", 500, "HTTP_ERROR", {
      cause: error,
    });
  }
}
