import { PaginatedData } from "@/components/utils/pagination";
import { ClaimPattern } from "@/features/claim-pattern/claim-pattern.type";
import { HttpError } from "@/utils/errors";
import { fetchJson } from "@/utils/fetch-utils";
import { ApiErrorEnvelopeSchema } from "@/utils/next-api-utils";

type GetParams = { page: number; perPage?: number };

export const getClaimPatterns = async ({ page, perPage }: GetParams) => {
  const url = `/api/claim-patterns?page=${page}&perPage=${perPage}`;

  const body = await fetchJson(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const status = body?.status as string | undefined;

  if (status === "success") {
    return body.data as PaginatedData<ClaimPattern>;
  }

  const err = ApiErrorEnvelopeSchema.safeParse(body);
  if (err.success) {
    const statusCode =
      err.data.status === "fail" || err.data.errors ? 422 : 400;
    throw new HttpError(err.data.message, statusCode, "APPLICATION_ERROR");
  }

  throw new HttpError("Réponse API inattendue.", 502, "HTTP_ERROR");
};
