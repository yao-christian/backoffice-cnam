"use client";

import { useState } from "react";
import clsx from "clsx";
import { signOut } from "next-auth/react";

import { useSidebarStore } from "@/components/admin-layout/second-admin-layout/store-provider";
import { PanelLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function SecondAdminLayoutHeader() {
  const [dropdownOpenId, setDropdownOpenId] = useState("");

  const isSidebarOpen = useSidebarStore((state) => state.isOpen);
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  const isDropdownOpen = (id: string) => dropdownOpenId === id;

  const toggleDropdown = (dropdownId: string) => {
    return setDropdownOpenId(dropdownId);
  };

  const hndleLogout = () => {
    signOut({ redirectTo: "/" });
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50">
        <nav className="z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
          <div className="flex-1">
            <div className="flex items-center">
              <span
                className="cursor-pointer md:hidden"
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 cursor-pointer text-gray-500 md:hidden"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </span>

              <PanelLeftIcon
                onClick={toggleSidebar}
                className={cn(
                  "hidden h-6 w-6 cursor-pointer text-blue-900 duration-300 md:block",
                )}
              />
            </div>
          </div>
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
                className={clsx(
                  "absolute right-0 top-11 w-40 space-y-2 border-gray-500 bg-white p-4 shadow",
                  {
                    block: isDropdownOpen("user-id"),
                    hidden: !isDropdownOpen("user-id"),
                  },
                )}
              >
                <li className="cursor-pointer rounded px-2 py-1 hover:bg-gray-400 hover:text-gray-50">
                  <a className="text-sm"> Mon profil </a>
                </li>
                <li className="cursor-pointer rounded px-2 py-1 hover:bg-gray-400 hover:text-gray-50">
                  <span className="text-sm" onClick={hndleLogout}>
                    {" "}
                    Se déconnecter{" "}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {dropdownOpenId && (
        <div
          className="fixed bottom-0 left-0 right-0 top-0 z-40"
          onClick={() => setDropdownOpenId("")}
        />
      )}

      {isSidebarOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 top-0 z-40 cursor-pointer bg-gray-950/20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
