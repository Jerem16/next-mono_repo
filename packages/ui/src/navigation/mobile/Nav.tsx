"use client";

import { memo } from "react";
import type { MenuItem } from "./data";
import ButtonOpen from "./ButtonOpen";
import MenuOpen from "./MenuOpen";
interface NavProps {
    menuItems: {
        mainLink?: MenuItem[];
    };
    onNavigationClick: (path: string) => void;
}

const Nav: React.FC<NavProps> = ({ menuItems, onNavigationClick }) => {
    return (
        <>
            <ButtonOpen />
            <MenuOpen menuItems={menuItems} onNavigationClick={onNavigationClick} />
        </>
    );
};

export default memo(Nav);
