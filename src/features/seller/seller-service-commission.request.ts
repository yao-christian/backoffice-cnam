import { SellerServiceCommission } from "./seller.type";
export const getSellerServiceCommissions = async (sellerAccountId: string) => {
  const response = await fetch(`/api/sellers/commissions/${sellerAccountId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      "La récuperation des commissions a échoué, veuillez réessayer.",
    );
  }

  const responseData = await response.json();

  return responseData.data as SellerServiceCommission[];
};
