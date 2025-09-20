"use client";

import { MenuProvider } from "@ui/navigation/menuState";
import { NavigationProvider } from "@utils/context/NavigationContext";
import { Header } from "@nav/index";
import { menuItems } from "@src/features/navigation/data/menuItems";
import { handleNavClick } from "@src/features/navigation/utils/fnScrollUtils";

const HeaderProps = () => {
    return (
        <MenuProvider>
            <NavigationProvider>
                <Header
                    menuItems={menuItems} // Assurez-vous que `menuItems` est bien importé
                    onNavigationClick={handleNavClick} // Passez ici la fonction appropriée
                />
            </NavigationProvider>
        </MenuProvider>
    );
};

export default HeaderProps;
