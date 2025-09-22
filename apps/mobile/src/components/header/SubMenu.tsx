// SubMenu.tsx
"use client";

import { useMemo, memo } from "react";
import { MenuItem } from "../../assets/data/menuItems";
import { useNavigation } from "../../utils/context/NavigationContext";
import { makePayloadClickHandler, makeActivationHandler } from "@utils/handlers";

interface SubMenuProps {
    menuItem: MenuItem;
    isOpen: boolean;
    onSubItemClick: (path: string) => void;
}

const SubMenu: React.FC<SubMenuProps> = ({ menuItem, isOpen, onSubItemClick }) => {
    const { closeHamburgerMenu } = useNavigation();

    const handleSubItemClick = useMemo(
        () =>
            makePayloadClickHandler<string>(onSubItemClick, {
                close: closeHamburgerMenu,
                delay: 650,
            }),
        [onSubItemClick, closeHamburgerMenu]
    );

    const handleKeyDown = useMemo(
        () => makeActivationHandler<string>(onSubItemClick),
        [onSubItemClick]
    );

    if (!menuItem.subItems || menuItem.subItems.length === 0) return null;

    return (
        <div className={`submenu ${isOpen ? "open" : ""}`}>
            <div className="submenu_group">
                {isOpen &&
                    menuItem.subItems.map((subItem) => {
                        const fullPath = `${menuItem.path}${subItem.AnchorId}`;
                        return (
                            <a
                                key={subItem.id}
                                aria-label={`Section ${subItem.title}`}
                                href={fullPath}
                                className={`nav-link ${subItem.class}`}
                                tabIndex={0}
                                onClick={(e) => handleSubItemClick(fullPath, e)}
                                onKeyDown={(e) => handleKeyDown(fullPath, e)}
                            >
                                {subItem.title}
                            </a>
                        );
                    })}
            </div>
        </div>
    );
};

export default memo(SubMenu);
