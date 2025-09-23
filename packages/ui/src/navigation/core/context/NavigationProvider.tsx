"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

import { createUseContext } from "./createUseContext";

export interface NavigationContextValue {
    currentRoute: string;
    updateRoute: (path: string) => void;
    openSubMenu: string | null;
    setOpenSubMenu: (subMenuId: string | null) => void;
    hamburgerMenuIsOpen: boolean;
    openHamburgerMenu: () => void;
    closeHamburgerMenu: (delay?: number) => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(
    undefined
);

const useNavigationState = (): NavigationContextValue => {
    const router = useRouter();
    const pathname = usePathname();
    const [currentRoute, setCurrentRoute] = useState(pathname || "/");
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const [hamburgerMenuIsOpen, setHamburgerMenuIsOpen] = useState(false);

    useEffect(() => {
        setCurrentRoute(pathname || "/");
    }, [pathname]);

    const updateRoute = (path: string) => {
        setCurrentRoute(path);
        router.push(path);
    };

    const openHamburgerMenu = () => setHamburgerMenuIsOpen(true);

    const closeHamburgerMenu = (delay: number = 0) => {
        window.setTimeout(() => setHamburgerMenuIsOpen(false), delay);
    };

    return {
        currentRoute,
        updateRoute,
        openSubMenu,
        setOpenSubMenu,
        hamburgerMenuIsOpen,
        openHamburgerMenu,
        closeHamburgerMenu,
    };
};

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
    const navigationState = useNavigationState();

    return (
        <NavigationContext.Provider value={navigationState}>{children}</NavigationContext.Provider>
    );
};

export const useNavigation = createUseContext<NavigationContextValue>(
    NavigationContext,
    "useNavigation"
);
