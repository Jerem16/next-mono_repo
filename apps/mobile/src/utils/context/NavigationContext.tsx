"use client";
import React, { createContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { type MenuCloseReason, useMenu } from "@ui/navigation/menuState";
interface NavigationContextType {
    currentRoute: string;
    updateRoute: (path: string) => void;
    openSubMenu: string | null;
    setOpenSubMenu: (subMenuId: string | null) => void;
    hamburgerMenuIsOpen: boolean;
    openHamburgerMenu: () => void;
    closeHamburgerMenu: (reason?: MenuCloseReason) => void;
    toggleHamburgerMenu: () => void;
}
const NavigationContext = createContext<NavigationContextType | undefined>(
    undefined
);
const useNavigationState = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { isOpen, open, close, toggle } = useMenu();
    const [currentRoute, setCurrentRoute] = useState(pathname || "/");
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    useEffect(() => {
        setCurrentRoute(pathname || "/");
    }, [pathname]);
    const updateRoute = (path: string) => {
        setCurrentRoute(path);
        router.push(path);
    };
    return {
        currentRoute,
        updateRoute,
        openSubMenu,
        setOpenSubMenu,
        hamburgerMenuIsOpen: isOpen,
        openHamburgerMenu: open,
        closeHamburgerMenu: close,
        toggleHamburgerMenu: toggle,
    };
};
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigationState = useNavigationState();
    return (
        <NavigationContext.Provider value={navigationState}>{children}</NavigationContext.Provider>
    );
};
import { createUseContext } from "./utils/createUseContext";
export const useNavigation = createUseContext<NavigationContextType>(
    NavigationContext,
    "useNavigation"
);
