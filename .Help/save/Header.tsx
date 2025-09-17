"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import Logo from "../svg_Icon/Logo";
import { useScrollContext } from "../../utils/context/ScrollContext";
import { useNavigation } from "../../utils/context/NavigationContext";
import { MenuItem, menuItems } from "@assets/data/menuItems";
import { updateMenuClasses } from "../../utils/updateMenuUtils";
import { handleScrollClick, handleNavClick } from "../../utils/fnScrollUtils";
import { useInitialScroll } from "../../utils/scrollUtils";
import useResize from "./utils/useResize";
import { useAuthenticator } from "@aws-amplify/ui-react";
// import { PowerButton } from "../buttons";
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

const SIGN_OUT_SENTINEL = "__SIGNOUT__";

const Header: React.FC = () => {
    const pathname = usePathname();
    const { currentRoute, updateRoute } = useNavigation();
    const { activeSection } = useScrollContext();
    const { user, signOut } = useAuthenticator();

    useInitialScroll(pathname);

    const [tabletMain, setTabletMain] = useState(false);
    const [openMainButton, setOpenMainButton] = useState(false);
    const [openButton, setOpenButton] = useState(false);
    const [bigMenu, setBigMenu] = useState(false);

    useResize(setTabletMain, setOpenMainButton, setOpenButton, setBigMenu);

    // Wrapper pour adapter `handleNavClick` + gérer la déconnexion
    const handleNavigationClick = (path: string, scrollOffset = 0) => {
        if (path === SIGN_OUT_SENTINEL) {
            // Appel Amplify
            signOut();
            return;
        }
        handleNavClick(path, currentRoute, updateRoute, handleScrollClick, scrollOffset);
    };

    // Classes actives habituelles
    const updatedMenuItems = updateMenuClasses(
        menuItems.mainLink,
        menuItems.reservation,
        menuItems.search,
        menuItems.connection,
        activeSection,
        currentRoute
    );

    // Adapter dynamiquement l’item "connection" si l’utilisateur est connecté
    const adaptedMenuItems = {
        ...updatedMenuItems,
        connection: updatedMenuItems.connection?.map((item) => {
            if (!user) return item; // laissé "Se connecter"
            return {
                ...item,
                title: "Déconnexion",
                // on remplace la navigation par un "pseudo-lien" capté plus haut
                path: SIGN_OUT_SENTINEL,
                AnchorId: undefined,
                subItems: [], // pas de sous-menu en mode déconnexion
                // Tu peux remplacer par "Power" si tu ajoutes l’icône (section 3)
                svg: item.svg ?? "Connection",
                // petite classe utile si tu veux du style rouge (section 4)
                class: `${item.class ?? ""} signout`.trim(),
            };
        }),
    };

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
                menuItems={adaptedMenuItems}
                onNavigationClick={handleNavigationClick}
                tabletMain={tabletMain}
                openMainButton={openMainButton}
                setOpenMainButton={setOpenMainButton}
                openButton={openButton}
                bigMenu={bigMenu}
            />
        </div>
    );
};

export default Header;
