"use client";

import { createContext, useRef, useContext, useLayoutEffect } from "react";

import { useMediaQuery } from "usehooks-ts";

import { type StoreApi, useStore } from "zustand";

import {
  type SidebarStore,
  createSidebarStore,
  initSidebarStore,
} from "@/stores/sidebar.store";

export const SidebarStoreContext = createContext<StoreApi<SidebarStore> | null>(
  null
);

export interface SidebarStoreProviderProps {
  children: React.ReactNode;
}

export const SidebarStoreProvider = ({
  children,
}: SidebarStoreProviderProps) => {
  const storeRef = useRef<StoreApi<SidebarStore>>(undefined);

  if (!storeRef.current) {
    storeRef.current = createSidebarStore(initSidebarStore());
  }

  return (
    <SidebarStoreContext.Provider value={storeRef.current}>
      {children}
    </SidebarStoreContext.Provider>
  );
};

export const useSidebarStore = <T,>(
  selector: (store: SidebarStore) => T
): T => {
  const sidebarStoreContext = useContext(SidebarStoreContext);

  if (!sidebarStoreContext) {
    throw new Error(`useSidebarStore must be use within SidebarStoreProvider`);
  }

  const matches = useMediaQuery("(min-width: 768px)");

  useLayoutEffect(() => {
    sidebarStoreContext.setState(() => ({
      isOpen: matches,
    }));
  }, []);

  return useStore(sidebarStoreContext, selector);
};
