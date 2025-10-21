import { PaginatedData } from "@/components/utils/pagination";
import { AuditLog } from "@/features/audit/audit.type";

type GetParams = { page: number; perPage?: number };

export const getAudits = async ({ page, perPage }: GetParams) => {
  const response = await fetch(`/api/audits?page=${page}&perPage=${perPage}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("La récuperation des audits a échoué, veuillez réessayer.");
  }

  const responseData = await response.json();

  return responseData.data as PaginatedData<AuditLog>;
};
