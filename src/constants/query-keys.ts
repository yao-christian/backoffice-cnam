export const QUERY_KEYS = {
  SERVICES: ["services"],
  DUPLICATA: ["duplicata"],
  ROLES: ["roles"],
  ROLE_DETAILS: (uuid: string) => ["role", "details", uuid],
};
