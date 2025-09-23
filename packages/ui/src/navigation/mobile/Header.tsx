"use client";

// Header.tsx
import { useMemo, memo } from "react";
import LogoLink from "./LogoLink";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import {
    useScrollContext,
    useNavigation,
    useSmoothScroll,
    useInitialScroll,
    updateMenuClasses,
    makeClickHandler,
} from "../core";
import { menuItems } from "./data";

const Header = () => {
    const pathname = usePathname();
    const { currentRoute, updateRoute, closeHamburgerMenu } = useNavigation();
    const { activeSection } = useScrollContext();

    useInitialScroll(pathname);

    const handleNavigationClick = useSmoothScroll(currentRoute, updateRoute);

    const handleLogoClick = useMemo(
        () =>
            makeClickHandler(() => {
                closeHamburgerMenu(200);
                handleNavigationClick("/#top");
            }),
        [closeHamburgerMenu, handleNavigationClick]
    );

    const updatedMenuItems = useMemo(
        () => updateMenuClasses(menuItems.mainLink, activeSection, currentRoute),
        [activeSection, currentRoute]
    );

    return (
        <div className="ha header">
            <LogoLink onClick={handleLogoClick} />
            <Nav menuItems={updatedMenuItems} onNavigationClick={handleNavigationClick} />
        </div>
    );
};

export default memo(Header);
