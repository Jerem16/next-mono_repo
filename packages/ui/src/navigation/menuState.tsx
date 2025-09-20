"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type ReactNode
} from "react";

export type MenuCloseReason = "nav" | "outside" | "escape";

export interface MenuState {
  isOpen: boolean;
  open: () => void;
  close: (reason?: MenuCloseReason) => void;
  toggle: () => void;
  lastAction: MenuCloseReason | null;
}

const MenuContext = createContext<MenuState | null>(null);

const STORAGE_KEY = "menu:open";

export function MenuProvider({ children }: { children: ReactNode }): ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const lastActionRef = useRef<MenuCloseReason | null>(null);
  const [lastAction, setLastAction] = useState<MenuCloseReason | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (saved === "1") {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.sessionStorage.setItem(STORAGE_KEY, isOpen ? "1" : "0");
  }, [isOpen]);

  const open = useCallback(() => {
    lastActionRef.current = null;
    setLastAction(null);
    setIsOpen(true);
  }, []);

  const close = useCallback((reason?: MenuCloseReason) => {
    const nextReason = reason ?? null;
    lastActionRef.current = nextReason;
    setLastAction(nextReason);
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((current) => {
      const nextState = !current;
      const reason: MenuCloseReason | null = nextState ? null : "outside";
      lastActionRef.current = reason;
      setLastAction(reason);
      return nextState;
    });
  }, []);

  const value = useMemo<MenuState>(() => {
    return {
      isOpen,
      open,
      close,
      toggle,
      lastAction
    };
  }, [close, isOpen, lastAction, open, toggle]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu(): MenuState {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("useMenu must be used within <MenuProvider>");
  }

  return context;
}
