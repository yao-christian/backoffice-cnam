"use client";

import { Fragment, useState } from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Separator } from "@radix-ui/react-separator";

import { SidebarTrigger } from "@/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { SidebarMenuItemModel } from "../types";

interface BreadcrumbItem {
  label: string;
  url: string;
}

// Fonction utilitaire pour trouver le chemin de navigation basé sur l'URL
const getPageBreadcrumb = (
  pathname: string,
  menuItems: SidebarMenuItemModel[],
): BreadcrumbItem[] => {
  const pathParts = pathname.split("/").filter(Boolean);
  const result: BreadcrumbItem[] = [];

  const findInMenu = (
    items: SidebarMenuItemModel[],
    currentPath: string,
    depth: number,
  ): boolean => {
    for (const item of items) {
      const itemUrlParts = item.url.split("/").filter(Boolean);
      if (itemUrlParts[depth] === pathParts[depth]) {
        result.push({ label: item.label, url: item.url });
        if (depth === pathParts.length - 1 || item.subMenus.length === 0) {
          return true;
        }
        return findInMenu(item.subMenus, currentPath, depth + 1);
      }
    }
    return false;
  };

  findInMenu(menuItems, pathname, 0);
  return result;
};

type PropsType = React.ComponentProps<"div"> & {
  sidebarItems: SidebarMenuItemModel[];
};

export function MainAdminLayoutHeader({ sidebarItems, className }: PropsType) {
  const [dropdownOpenId, setDropdownOpenId] = useState("");
  const pathname = usePathname();

  const breadcrumbItems = getPageBreadcrumb(pathname, sidebarItems);

  const toggleDropdown = (dropdownId: string) => {
    return setDropdownOpenId(dropdownId);
  };

  const hndleLogout = () => {
    signOut({ redirectTo: "/" });
  };

  const isDropdownOpen = (id: string) => dropdownOpenId === id;

  return (
    <div className={className}>
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink asChild>
                <Link href="/">Tableau de bord</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="hidden md:block" />

            {breadcrumbItems.map((item, index) => (
              <Fragment key={item.url}>
                <BreadcrumbItem>
                  {index === breadcrumbItems.length - 1 ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={item.url}>{item.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="absolute right-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={() => toggleDropdown("user-id")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-7 w-7 fill-gray-500"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>

              <ul
                className={cn(
                  "absolute right-0 top-11 w-40 space-y-2 border-gray-500 bg-white p-4 shadow",
                  {
                    block: isDropdownOpen("user-id"),
                    hidden: !isDropdownOpen("user-id"),
                  },
                )}
              >
                {/* <li className="cursor-pointer rounded px-2 py-1 hover:bg-gray-400 hover:text-gray-50">
                  <a className="text-sm"> Mon profil </a>
                </li> */}
                <li className="cursor-pointer rounded px-2 py-1 hover:bg-gray-400 hover:text-gray-50">
                  <span className="text-sm" onClick={hndleLogout}>
                    {" "}
                    Se déconnecter{" "}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {dropdownOpenId && (
        <div
          className="fixed bottom-0 left-0 right-0 top-0 z-40"
          onClick={() => setDropdownOpenId("")}
        />
      )}
    </div>
  );
}
