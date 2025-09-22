import { memo } from "react";
import { MenuItem } from "../../assets/data/menuItems";
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
