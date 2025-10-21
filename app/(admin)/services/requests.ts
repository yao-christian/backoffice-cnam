import { PaginatedData } from "@/components/utils/pagination";
import { Service } from "@/features/service/service.type";
import { HttpError } from "@/utils/errors";
import { fetchJson } from "@/utils/fetch-utils";
import { ApiErrorEnvelopeSchema } from "@/utils/next-api-utils";

type GetServicesParams = { page: number; perPage?: number };

export const getServices = async ({ page, perPage }: GetServicesParams) => {
  const url = `/api/services?page=${page}&perPage=${perPage}`;

  const body = await fetchJson(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const status = body?.status as string | undefined;

  if (status === "success") {
    return body.data as PaginatedData<Service>;
  }

  const err = ApiErrorEnvelopeSchema.safeParse(body);
  if (err.success) {
    const statusCode =
      err.data.status === "fail" || err.data.errors ? 422 : 400;
    throw new HttpError(err.data.message, statusCode, "APPLICATION_ERROR");
  }

  throw new HttpError("Réponse API inattendue.", 502, "HTTP_ERROR");
};
