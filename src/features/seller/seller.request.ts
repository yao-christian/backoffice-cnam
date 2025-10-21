import { Seller } from "./seller.type";

export const getAllSellers = async () => {
  const response = await fetch("/api/sellers/all", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      "La récuperation des vendeurs a échoué, veuillez réessayer.",
    );
  }

  const responseData = await response.json();

  return responseData.data as Seller[];
};
