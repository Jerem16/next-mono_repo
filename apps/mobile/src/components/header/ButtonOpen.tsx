// ButtonOpen.tsx
import { useCallback, memo } from "react";
import { useNavigation } from "../../utils/context/NavigationContext";
import MenuIcon from "@components/svg_Icon/utils/MenuIcon";

const ButtonOpen = () => {
    const { hamburgerMenuIsOpen, openHamburgerMenu, closeHamburgerMenu } = useNavigation();
    const handleClick = useCallback(() => {
        if (hamburgerMenuIsOpen) {
            closeHamburgerMenu(1);
        } else {
            openHamburgerMenu();
        }
    }, [hamburgerMenuIsOpen, openHamburgerMenu, closeHamburgerMenu]);

    return (
        <button
            aria-label={hamburgerMenuIsOpen ? "fermer le menu" : "ouvrir le menu"}
            aria-expanded={hamburgerMenuIsOpen}
            aria-controls="main-nav"
            onClick={handleClick}
            className="menu"
        >
            <MenuIcon isOpen={hamburgerMenuIsOpen} />
        </button>
    );
};

export default memo(ButtonOpen);
