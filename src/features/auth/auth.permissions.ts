import type { Permissions } from "./auth.types";

export function hasPermission(
  permissions: Permissions,
  permission: string,
): boolean {
  return permissions[permission] === true;
}

export function hasAnyPermission(
  permissions: Permissions,
  permissionList: string[],
): boolean {
  return permissionList.some((permission) => permissions[permission] === true);
}

export function hasAllPermissions(
  permissions: Permissions,
  permissionList: string[],
): boolean {
  return permissionList.every((permission) => permissions[permission] === true);
}

export function canCreate(permissions: Permissions, resource: string): boolean {
  return hasPermission(permissions, `create:${resource}`);
}

export function canRead(permissions: Permissions, resource: string): boolean {
  return hasPermission(permissions, `read:${resource}`);
}

export function canUpdate(permissions: Permissions, resource: string): boolean {
  return hasPermission(permissions, `update:${resource}`);
}

export function canDelete(permissions: Permissions, resource: string): boolean {
  return hasPermission(permissions, `delete:${resource}`);
}

export function canShow(permissions: Permissions, resource: string): boolean {
  return hasPermission(permissions, `show:${resource}`);
}
