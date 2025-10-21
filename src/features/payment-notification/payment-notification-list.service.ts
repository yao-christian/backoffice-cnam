import {
  HttpError,
  NotFoundError,
  UserNotAuthenticatedError,
} from "@/utils/errors";

import { customFetch } from "@/components/utils/custom-fetch";
import { ApiResponse } from "@/types/api";

import {
  adaptPaymentNotification,
  ApiPaginationSchema,
  ApiPaymentNotificationItemSchema,
} from "./schemas/api.schemas";

import { PaymentNotification } from "./payment-notification.type";
import { formatPaginatedData } from "@/components/utils/pagination";

export async function getPaymentNotificationsWithPagination({
  page = 0,
  perPage = 10,
}) {
  const apiPage = page + 1;
  const url = `${process.env.API_URL}/api/cotisation/payment-notifications?page=${apiPage}&limit=${perPage}`;

  try {
    const response = await customFetch(url, { isAuth: true });

    if (!response.ok) {
      if (response.status === 401) throw new UserNotAuthenticatedError();
      if (response.status === 404)
        throw new NotFoundError("Liste des cotisations introuvable.");

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
          "Impossible de récupérer les cotisation. Veuillez réessayer plus tard.",
        422,
        "APPLICATION_ERROR",
      );
    }

    const parsedResponseData = ApiPaginationSchema.parse(responseData.data);

    const PaymentNotifications: PaymentNotification[] =
      parsedResponseData.data.map((it) =>
        adaptPaymentNotification(ApiPaymentNotificationItemSchema.parse(it)),
      );

    const totalCount = parsedResponseData.total;
    const totalPages = parsedResponseData.last_page;

    return formatPaginatedData<PaymentNotification>({
      totalCount,
      totalPages,
      page,
      perPage: parsedResponseData.per_page,
      data: PaymentNotifications,
    });
  } catch (error: any) {
    console.error("Erreur dans getPaymentNotificationsWithPagination:", error);

    if (error instanceof HttpError) throw error;

    throw new HttpError("Erreur inattendue du client.", 500, "HTTP_ERROR", {
      cause: error,
    });
  }
}
