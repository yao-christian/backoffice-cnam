import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getRoleDetails, getRoles } from "./role.request";

export const useRoleDetails = (uuid: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ROLE_DETAILS(uuid),
    queryFn: async () => {
      return await getRoleDetails(uuid);
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useRoles = () => {
  return useQuery({
    queryKey: QUERY_KEYS.ROLES,
    queryFn: async () => {
      return await getRoles({ page: 0, perPage: 1000 });
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
