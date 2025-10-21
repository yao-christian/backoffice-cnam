import { PaginatedData } from "@/components/utils/pagination";
import { Deposit } from "@/features/deposit/deposit.type";

type GetDepositsParams = { page: number; perPage?: number };

export const getDeposits = async ({ page, perPage }: GetDepositsParams) => {
  const response = await fetch(
    `/api/deposits?page=${page}&perPage=${perPage}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error(
      "La récuperation des vendeurs a échoué, veuillez réessayer.",
    );
  }

  const responseData = await response.json();

  return responseData.data as PaginatedData<Deposit>;
};
