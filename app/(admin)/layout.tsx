import { LayoutParams } from "@/types/next";

import { GlobalAlertDialog } from "@/components/global-alert-dialog";
import { GlobalModal } from "@/components/global-modal";
import { SIDEBAR_MENUS } from "@/components/admin-layout/constantes";
import { FourthAdminLayout } from "@/components/admin-layout/fourth-admin-layout/layout";
import { getCurrentUser } from "@/features/auth/auth-session";

export default async function AdminLayout({ children }: LayoutParams<{}>) {
  const authSession = await getCurrentUser();

  let authSidebarMenus = SIDEBAR_MENUS;

  authSidebarMenus = SIDEBAR_MENUS.map((sidebarItem) => {
    if (sidebarItem.code === "settings") {
      return {
        ...sidebarItem,
        subMenus: sidebarItem.subMenus.filter((menu) => menu.code !== "jobs"),
      };
    }
    return sidebarItem;
  });

  return (
    <FourthAdminLayout
      authSession={authSession}
      sidebarMenuItems={authSidebarMenus}
    >
      {children}
      <GlobalAlertDialog />
      <GlobalModal />
    </FourthAdminLayout>
  );
}
