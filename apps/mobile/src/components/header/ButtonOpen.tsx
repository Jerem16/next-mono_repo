// ButtonOpen.tsx
import { useCallback, memo } from "react";
import { useNavigation } from "../../utils/context/NavigationContext";
import MenuIcon from "@components/svg_Icon/utils/MenuIcon";

const ButtonOpen = () => {
    const { hamburgerMenuIsOpen, toggleHamburgerMenu } = useNavigation();
    const handleClick = useCallback(() => {
        toggleHamburgerMenu();
    }, [toggleHamburgerMenu]);

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
