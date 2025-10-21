"use client";

import { Fragment } from "react";

import { Bell, ChevronDown, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Icons from "../icons";
import { isActive } from "../utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { cn } from "@/lib/utils";

import { SidebarMenuItemModel } from "../types";
// import { logoutAction } from "@/features/auth/auth-session";

interface BreadcrumbItem {
  label: string;
  url: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
  sidebarMenuItems: SidebarMenuItemModel[];
  authSession?: any;
}

export function FourthAdminLayout({
  children,
  sidebarMenuItems,
  authSession,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const breadcrumbItems = getPageBreadcrumb(pathname, sidebarMenuItems);

  const user = authSession?.user;

  const renderMenuItem = (item: SidebarMenuItemModel) => {
    if (item.subMenus && item.subMenus.length > 0) {
      return (
        <SidebarMenuItem key={item.id}>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                className={cn(
                  "w-full justify-between",
                  "hover:bg-accent/50",
                  "data-[state=open]:bg-sidebar-accent/35 data-[state=open]:text-white",
                )}
              >
                <div className="flex items-center gap-2">
                  <Icons iconName={item.icon} />
                  <span>{item.label}</span>
                </div>
                <ChevronDown className="chevron-icon ml-auto size-4 transition-transform duration-200" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.subMenus.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.id}>
                    <SidebarMenuSubButton
                      asChild
                      className="hover:bg-accent/50"
                    >
                      <Link href={`/${item.url}/${subItem.url}`}>
                        {subItem.label}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
          <style jsx global>{`
            [data-state="open"] .chevron-icon {
              transform: rotate(180deg);
            }
          `}</style>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton
          asChild
          isActive={isActive(pathname, `/${item.url}`)}
        >
          <Link href={`/${item.url}`}>
            <Icons iconName={item.icon} />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const logout = async () => {
    // logoutAction();
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[hsl(var(--content-background))]">
        <Sidebar className="border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))]">
          <SidebarHeader className="h-12 px-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-12 rounded border-2 border-white bg-white">
                <AvatarImage src="/images/logo.png" alt="Logo" />
                <AvatarFallback>NGSER</AvatarFallback>
              </Avatar>
              <div className="font-semibold uppercase">Backoffice CNAM</div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarMenu>{sidebarMenuItems.map(renderMenuItem)}</SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex w-full flex-col bg-gray-50">
          <header className="flex h-14 items-center gap-4 border-b bg-white px-2 sm:px-4 md:px-6">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon">
                <Bell className="size-5" />
              </Button>

              <DropdownMenu>
                {user ? (
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto w-full justify-start px-2"
                    >
                      <Avatar className="size-6">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>CH</AvatarFallback>
                      </Avatar>
                      <span className="ml-2">{user?.name}</span>
                      <ChevronDown className="ml-auto size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                ) : null}

                <DropdownMenuContent
                  align="start"
                  className="w-[--radix-dropdown-menu-trigger-width]"
                >
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href="/profile">
                      <User className="mr-2 size-4" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 size-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="border-b bg-white p-2">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink asChild>
                        <Link href="/admin">Admin</Link>
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
              </div>
              <div className="min-w-full overflow-x-auto px-6 py-4">
                {children}
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
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
