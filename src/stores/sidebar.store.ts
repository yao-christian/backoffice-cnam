import { createStore } from "zustand";

type SidebarState = {
  isOpen: boolean;
};

type SidebarAction = {
  toggle: () => void;
  setIsOpen: (isOpen: boolean) => void;
};

export type SidebarStore = SidebarState & SidebarAction;

export const initSidebarStore = (): SidebarState => {
  return { isOpen: true };
};

export const defaultInitState: SidebarState = {
  isOpen: true,
};

export const createSidebarStore = (initialState = defaultInitState) => {
  return createStore<SidebarStore>()((set) => ({
    ...initialState,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
    setIsOpen: (isOpen) => set((state) => ({ isOpen: isOpen })),
  }));
};
