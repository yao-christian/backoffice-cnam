import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getAllSellers } from "./seller.request";

export const useSellers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SELLERS,
    queryFn: async () => {
      return await getAllSellers();
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
