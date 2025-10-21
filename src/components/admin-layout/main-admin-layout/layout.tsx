import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { SidebarMenuItemModel } from "../types";
import { MainAdminLayoutHeader } from "./header";
import { MainAdminLayoutSidebar } from "./sidebar";

type PropsType = React.PropsWithChildren & {
  sidebarMenuItems: SidebarMenuItemModel[];
};

export async function MainAdminLayout({
  children,
  sidebarMenuItems,
}: PropsType) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <MainAdminLayoutSidebar sidebarItems={sidebarMenuItems} />

        <SidebarInset className="flex w-full flex-col bg-gray-50">
          <MainAdminLayoutHeader
            sidebarItems={sidebarMenuItems}
            className="flex-shrink-0"
          />

          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="min-w-full overflow-x-auto p-4">{children}</div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
