export const ACTIONS = ["create", "read", "update", "show", "delete"] as const;

export const MENUS = [
  "roles",
  "services",
  "cotisations",
  "duplicatas",
] as const;

export type Action = (typeof ACTIONS)[number];
export type Menu = (typeof MENUS)[number];

export const makePermission = (action: Action, menu: Menu) =>
  `${action}:${menu}` as const;

export const ALL_PERMISSIONS = MENUS.flatMap((menu) =>
  ACTIONS.map((action) => makePermission(action, menu as Menu)),
);
