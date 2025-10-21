import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getSellerServiceCommissions } from "./seller-service-commission.request";

export const useSellerServiceCommissions = (sellerAccountId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.SELLER_SERVICE_COMMISSIONS(sellerAccountId),
    queryFn: async () => {
      return await getSellerServiceCommissions(sellerAccountId);
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
