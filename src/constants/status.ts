export const DEFAULT_STATUS = {
  disable: { code: 0, name: "Désactivé" },
  active: { code: 1, name: "Activé" },
};

export const USER_STATUS = {
  disable: { code: 0, name: "Désactivé" },
  active: { code: 1, name: "Activé" },
};

export const USER_STATUS_LIST: { code: number; name: string }[] =
  Object.values(USER_STATUS);
