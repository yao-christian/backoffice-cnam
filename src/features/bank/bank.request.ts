import { Bank } from "./bank.type";

export const getAllBanks = async () => {
  const response = await fetch("/api/banks/all", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      "La récuperation des banques a échoué, veuillez réessayer.",
    );
  }

  const responseData = await response.json();

  return responseData.data as Bank[];
};
