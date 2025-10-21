"use client";

import { SecondAdminLayoutHeader } from "./header";
import { SecondAdminLayoutSidebar } from "./sidebar";

import clsx from "clsx";
import {
  useSidebarStore,
  SidebarStoreProvider,
} from "@/components/admin-layout/second-admin-layout/store-provider";
import { SidebarMenuItemModel } from "../types";
import { AuthSession } from "@/features/auth/auth.types";

type PropsType = {
  sidebarMenuItems: SidebarMenuItemModel[];
  children: React.ReactNode;
  authSession?: AuthSession;
};

export function SecondAdminLayout({ children, sidebarMenuItems }: PropsType) {
  return (
    <SidebarStoreProvider>
      <AdminLayout sidebarMenuItems={sidebarMenuItems}>{children}</AdminLayout>
    </SidebarStoreProvider>
  );
}

function AdminLayout({ children, sidebarMenuItems }: PropsType) {
  const isSidebarOpen = useSidebarStore((state) => state.isOpen);

  return (
    <>
      <SecondAdminLayoutHeader />

      <div className="dark:bg-zinc-800 [&>*]:leading-[1.6]">
        <SecondAdminLayoutSidebar sidebarItems={sidebarMenuItems} />

        <div
          className={clsx(
            "min-h-screen w-full bg-gray-50 pl-0 duration-300 md:pl-20",
            {
              "md:pl-60": isSidebarOpen,
            },
          )}
        >
          <div className="px-10 pb-5 pt-20">{children}</div>
        </div>
      </div>
    </>
  );
}
