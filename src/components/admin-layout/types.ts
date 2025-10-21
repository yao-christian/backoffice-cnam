export type SidebarMenuItemModel = {
  id: number;
  label: string;
  url: string;
  icon: string | null;
  code: string;
  position: number;
  parentMenuId: number | null;
  statusCode: string;
  subMenus: SidebarMenuItemModel[];
};
