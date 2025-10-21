import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getAllBanks } from "./bank.request";

export const useBanks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.BANKS,
    queryFn: async () => {
      return await getAllBanks();
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
