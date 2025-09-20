import { memo, type FC } from "react";
import type { MenuItem } from "../../assets/data/menuItems";
import ButtonOpen from "./ButtonOpen";
import MenuOpen from "./MenuOpen";
interface NavProps {
    menuItems: {
        mainLink?: MenuItem[];
    };
    onNavigationClick: (path: string) => void;
}

const Nav: FC<NavProps> = ({ menuItems, onNavigationClick }) => (
    <>
        <ButtonOpen />
        <MenuOpen menuItems={menuItems} onNavigationClick={onNavigationClick} />
    </>
);

export default memo(Nav);
