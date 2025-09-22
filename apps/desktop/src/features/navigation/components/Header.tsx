import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Logo from "@src/features/navigation/icons/Logo";
import { useScrollContext } from "@utils/context/ScrollContext";
import { useNavigation } from "@utils/context/NavigationContext";
import { MenuItem, menuItems } from "@src/features/navigation/data/menuItems";
import { updateMenuClasses } from "@src/features/navigation/utils/updateMenuUtils";
import { handleScrollClick, handleNavClick } from "@src/features/navigation/utils/fnScrollUtils";
import { useInitialScroll } from "@src/features/navigation/utils/scrollUtils";
import useResize from "@src/features/navigation/components/utils/useResize";

interface NavProps {
    menuItems: MenuItem[];
    onNavigationClick: (path: string, scrollOffset?: number) => void;
    openButton: boolean;
    openMainButton: boolean;
    tabletMain: boolean;
    bigMenu: boolean;
    setBigMenu: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenMainButton: React.Dispatch<React.SetStateAction<boolean>>;
    setTabletMain: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<NavProps> = () => {
    const pathname = usePathname();
    const { currentRoute, updateRoute } = useNavigation();
    const { activeSection } = useScrollContext();

    useInitialScroll(pathname);

    const [tabletMain, setTabletMain] = useState(false);
    const [openMainButton, setOpenMainButton] = useState(false);
    const [openButton, setOpenButton] = useState(false);
    const [bigMenu, setBigMenu] = useState(false);

    useResize(setTabletMain, setOpenMainButton, setOpenButton, setBigMenu);

    // Wrapper pour adapter `handleNavClick`
    const handleNavigationClick = (path: string, scrollOffset = 0) => {
        handleNavClick(path, currentRoute, updateRoute, handleScrollClick, scrollOffset);
    };

    const updatedMenuItems = updateMenuClasses(
        menuItems.mainLink,
        menuItems.reservation,
        menuItems.search,
        menuItems.connection,
        activeSection,
        currentRoute
    );

    return (
        <div className="header">
            <Link
                href="/#slider"
                aria-label="Retour à la page d'accueil : Peur de la conduite"
                className="logo-link"
            >
                <Logo />
            </Link>
            <Nav
                menuItems={updatedMenuItems}
                onNavigationClick={handleNavigationClick}
                tabletMain={tabletMain} // Gestion de la vue tablette
                openMainButton={openMainButton} // Gestion de la vue Desktop
                setOpenMainButton={setOpenMainButton}
                openButton={openButton}
                bigMenu={bigMenu} // Gestion de la vue Desktop large
            />
        </div>
    );
};

export default Header;
