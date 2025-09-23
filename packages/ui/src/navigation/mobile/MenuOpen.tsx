"use client";

import { useCallback, useMemo, memo } from "react";
import { useNavigation } from "../core";
import MenuList from "./MenuList";
import type { MenuItem } from "./data";
interface NavProps {
    menuItems: {
        mainLink?: MenuItem[];
    };
    onNavigationClick: (path: string) => void;
}

const MenuOpen: React.FC<NavProps> = ({ menuItems, onNavigationClick }) => {
    const { hamburgerMenuIsOpen, openSubMenu, setOpenSubMenu } = useNavigation();

    const handleMenuClick = useCallback(
        (menuItemId: string) => {
            setOpenSubMenu(openSubMenu === menuItemId ? null : menuItemId);
        },
        [openSubMenu, setOpenSubMenu]
    );

    const containerClass = useMemo(
        () => `head-flex absolute ${hamburgerMenuIsOpen ? "open" : ""}`,
        [hamburgerMenuIsOpen]
    );

    return (
        <div className={containerClass}>
            {hamburgerMenuIsOpen && menuItems.mainLink && (
                <MenuList
                    menuItems={menuItems.mainLink}
                    openSubMenu={openSubMenu}
                    onNavigationClick={onNavigationClick}
                    handleMenuClick={handleMenuClick}
                />
            )}
        </div>
    );
};

export default memo(MenuOpen);
