"use client";

import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";

import { useSidebarStore } from "@/components/admin-layout/second-admin-layout/store-provider";
import Icons from "./icons";
import { SidebarMenuItemModel } from "../types";

type PropsType = {
  sidebarItems: SidebarMenuItemModel[];
};

export function SecondAdminLayoutSidebar({ sidebarItems }: PropsType) {
  const pathname = usePathname();

  const [sidebarMenuOpenedIds, setSidebarMenuOpenedIds] = useState<number[]>(
    [],
  );

  const isSidebarOpen = useSidebarStore((state) => state.isOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggle);
  const setIsOpen = useSidebarStore((state) => state.setIsOpen);

  const isSidebarMenuOpen = (menuId: number) => {
    const foundMenuId = sidebarMenuOpenedIds.find((id) => id === menuId);
    return !!foundMenuId;
  };

  const toggleMenu = (menuId: number) => {
    const foundMenuId = sidebarMenuOpenedIds.find((id) => id === menuId);

    if (foundMenuId) {
      setSidebarMenuOpenedIds((mIds) => mIds.filter((mId) => mId !== menuId));
    } else {
      setSidebarMenuOpenedIds((mIds) => [...mIds, menuId]);
    }
  };

  const hasSubMenus = (sidebarMenu: SidebarMenuItemModel) => {
    return sidebarMenu.subMenus && sidebarMenu.subMenus.length > 0;
  };

  const handleClickSidebarMenu = (sidebarMenu: SidebarMenuItemModel) => {
    if (hasSubMenus(sidebarMenu) && isSidebarOpen) {
      toggleMenu(sidebarMenu.id);
    }

    if (
      !hasSubMenus(sidebarMenu) &&
      isSidebarOpen &&
      window.innerWidth <= 768
    ) {
      toggleSidebar();
    }
  };

  useLayoutEffect(() => {
    // setIsOpen(matches);
  }, [setIsOpen]);

  return (
    <nav
      className={clsx("fixed z-40 h-screen bg-orange-500 p-2 pt-16", {
        "visible w-60 duration-200": isSidebarOpen,
        "invisible w-0 md:visible md:w-20": !isSidebarOpen,
      })}
    >
      <ul className="pt-2">
        <li>
          <Link
            href="/"
            className="btn btn-ghost mb-5 ml-2 mt-2 flex items-center gap-3 font-semibold normal-case text-white"
          >
            <img className="h-6 w-auto" src="/images/logo.png" alt="Logo" />
            <span
              className={clsx("flex-1 duration-200", {
                hidden: !isSidebarOpen,
              })}
            >
              Gestion de vote
            </span>
          </Link>
        </li>
        {sidebarItems.map((sidebarMenu) => (
          <li key={sidebarMenu.id}>
            {hasSubMenus(sidebarMenu) ? (
              <div
                onClick={() => handleClickSidebarMenu(sidebarMenu)}
                className="mt-2 flex cursor-pointer items-center gap-x-4 truncate rounded p-2 text-sm text-white outline-none transition duration-300 ease-linear hover:bg-green-600 hover:text-white hover:outline-none focus:bg-green-600 focus:text-white focus:outline-none active:bg-green-600 active:text-white active:outline-none motion-reduce:transition-none"
              >
                <Icons iconName={sidebarMenu.icon} />

                <span
                  className={clsx("flex-1 duration-200", {
                    hidden: !isSidebarOpen,
                  })}
                >
                  {sidebarMenu.label}
                </span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="3"
                  stroke="currentColor"
                  className={clsx("h-4 w-4", {
                    "rotate-180": !isSidebarMenuOpen(sidebarMenu.id),
                  })}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 15.75 7.5-7.5 7.5 7.5"
                  />
                </svg>
              </div>
            ) : (
              <Link
                href={`/${sidebarMenu.url}`}
                onClick={() => handleClickSidebarMenu(sidebarMenu)}
                className={clsx(
                  "mt-2 flex cursor-pointer items-center gap-x-4 truncate rounded p-2 text-sm text-white outline-none transition duration-300 ease-linear hover:bg-green-600 hover:text-white hover:outline-none focus:bg-green-600 focus:text-white focus:outline-none active:bg-green-600 active:text-white active:outline-none motion-reduce:transition-none",
                  {
                    "bg-green-500 text-white": isActive(
                      pathname,
                      `/${sidebarMenu.url}`,
                    ),
                  },
                )}
              >
                <Icons iconName={sidebarMenu.icon} />

                <span
                  className={clsx("flex-1 duration-200", {
                    hidden: !isSidebarOpen,
                  })}
                >
                  {sidebarMenu.label}
                </span>

                {hasSubMenus(sidebarMenu) && isSidebarOpen && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="3"
                    stroke="currentColor"
                    className={clsx("h-4 w-4", {
                      "rotate-180": !isSidebarMenuOpen(sidebarMenu.id),
                    })}
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m4.5 15.75 7.5-7.5 7.5 7.5"
                    />
                  </svg>
                )}
              </Link>
            )}

            {hasSubMenus(sidebarMenu) &&
              isSidebarMenuOpen(sidebarMenu.id) &&
              isSidebarOpen && (
                <ul>
                  {sidebarMenu.subMenus?.map((subMenu) => (
                    <li key={subMenu.id}>
                      <Link
                        onClick={() => handleClickSidebarMenu(subMenu)}
                        href={`/${sidebarMenu.url}/${subMenu.url}`}
                        className={clsx(
                          "mt-2 flex cursor-pointer items-center gap-x-4 truncate rounded p-2 pl-10 text-sm text-orange-200 outline-none transition duration-300 ease-linear hover:bg-green-600 hover:text-white hover:outline-none focus:bg-green-600 focus:text-white focus:outline-none active:bg-green-600 active:text-white active:outline-none motion-reduce:transition-none",
                          {
                            "bg-green-500 text-white": isActive(
                              pathname,
                              `/${sidebarMenu.url}/${subMenu.url}`,
                            ),
                          },
                        )}
                      >
                        {subMenu.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function isActive(pathname: string, url: string): boolean {
  return pathname === url;
}
