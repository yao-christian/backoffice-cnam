import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getAllServices } from "./service.request";

export const useServices = () => {
  return useQuery({
    queryKey: QUERY_KEYS.SERVICES,
    queryFn: async () => {
      return await getAllServices();
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
