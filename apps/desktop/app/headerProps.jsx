"use client";

import { NavigationProvider } from "@utils/context/NavigationContext";
import { Header } from "@src/features/navigation/index";
import { menuItems } from "@src/features/navigation/data/menuItems";
import { handleNavClick } from "@src/features/navigation/utils/fnScrollUtils";

const HeaderProps = () => {
    return (
        <NavigationProvider>
            <Header
                menuItems={menuItems} // Assurez-vous que `menuItems` est bien importé
                onNavigationClick={handleNavClick} // Passez ici la fonction appropriée
            />
        </NavigationProvider>
    );
};

export default HeaderProps;
