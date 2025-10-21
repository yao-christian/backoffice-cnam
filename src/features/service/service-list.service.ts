import {
  HttpError,
  NotFoundError,
  UserNotAuthenticatedError,
} from "@/utils/errors";

import { customFetch } from "@/components/utils/custom-fetch";
import { ApiResponse } from "@/types/api";

import {
  adaptService,
  ApiPaginationSchema,
  ApiServiceItemSchema,
} from "./schemas/api.schemas";

import { Service } from "./service.type";
import { formatPaginatedData } from "@/components/utils/pagination";

export async function getServicesWithPagination({ page = 0, perPage = 10 }) {
  const apiPage = page + 1;
  const url = `${process.env.API_URL}/api/service/list?page=${apiPage}&limit=${perPage}`;

  try {
    const response = await customFetch(url, { isAuth: true });

    if (!response.ok) {
      if (response.status === 401) throw new UserNotAuthenticatedError();
      if (response.status === 404)
        throw new NotFoundError("Liste des services introuvable.");

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
          "Impossible de récupérer les services. Veuillez réessayer plus tard.",
        422,
        "APPLICATION_ERROR",
      );
    }

    const parsedResponseData = ApiPaginationSchema.parse(responseData.data);

    const services: Service[] = parsedResponseData.data.map((it) =>
      adaptService(ApiServiceItemSchema.parse(it)),
    );

    const totalCount = parsedResponseData.total;
    const totalPages = parsedResponseData.last_page;

    return formatPaginatedData<Service>({
      totalCount,
      totalPages,
      page,
      perPage: parsedResponseData.per_page,
      data: services,
    });
  } catch (error: any) {
    console.error("Erreur dans getServicesWithPagination:", error);

    if (error instanceof HttpError) throw error;

    throw new HttpError("Erreur inattendue du client.", 500, "HTTP_ERROR", {
      cause: error,
    });
  }
}
