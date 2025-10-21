"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  BadgeEuro,
  BookDown,
  Building2,
  CircleGauge,
  UserPlus,
  Users,
  Settings,
  ChevronRight,
  Database,
  ScanEye,
  MessageCircleQuestionIcon,
  SquareLibraryIcon,
  BookMinusIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { SidebarMenuItemModel } from "../types";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type PropsType = {
  sidebarItems: SidebarMenuItemModel[];
};

function isActive(pathname: string, url: string): boolean {
  return pathname === url;
}

export function MainAdminLayoutSidebar({ sidebarItems }: PropsType) {
  const pathname = usePathname();

  const { setOpen, isMobile } = useSidebar();

  const hasSubMenus = (sidebarMenu: SidebarMenuItemModel) => {
    return sidebarMenu.subMenus && sidebarMenu.subMenus.length > 0;
  };

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [pathname, setOpen, isMobile]);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="hover:bg-transparent data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex flex-col gap-0.5 leading-none">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="rounded-sm bg-white p-2">
                <img className="h-4 w-auto" src="/images/logo.png" alt="Logo" />
              </span>
              <span>Gestion de vote</span>
            </Link>
          </div>
        </SidebarMenuButton>
      </SidebarHeader>

      {/* <SidebarSeparator  /> */}

      <SidebarContent className="mt-2">
        {sidebarItems.map((item) =>
          hasSubMenus(item) ? (
            <Collapsible
              key={item.id}
              title={item.label}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground"
                >
                  <CollapsibleTrigger className="flex gap-2 pl-0">
                    <Icons iconName={item.icon} />
                    <span>{item.label}</span>
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.subMenus.map((subItem) => (
                        <SidebarMenuItem key={subItem.id} className="ml-4">
                          <SidebarMenuButton
                            className="text-sm"
                            asChild
                            isActive={isActive(
                              pathname,
                              `/${item.url}/${subItem.url}`,
                            )}
                          >
                            <Link href={`/${item.url}/${subItem.url}`}>
                              <span>{subItem.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          ) : (
            <SidebarMenu key={item.id}>
              <SidebarMenuItem>
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
            </SidebarMenu>
          ),
        )}
      </SidebarContent>
    </Sidebar>
  );
}

type PropsIconsType = {
  iconName?: string | null;
  size?: number;
};

export default function Icons({ iconName, size = 18 }: PropsIconsType) {
  switch (iconName) {
    case "dashboard":
      return <CircleGauge size={size} />;
    case "settings":
      return <Settings size={size} />;
    case "users":
      return <UserPlus size={size} />;
    case "sale":
      return <BadgeEuro size={size} />;
    case "company":
      return <Building2 size={size} />;
    case "deposit":
      return <BookDown size={size} />;
    case "sellers":
      return <Users size={size} />;
    case "vote":
      return <Database size={size} />;
    case "surveys":
      return <ScanEye size={size} />;
    case "questions":
      return <MessageCircleQuestionIcon size={size} />;
    case "elections":
      return <SquareLibraryIcon size={size} />;
    default:
      return <BookMinusIcon size={size} />;
  }
}
