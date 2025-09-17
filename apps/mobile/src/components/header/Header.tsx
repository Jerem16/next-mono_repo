// Header.tsx
import { useMemo, memo } from "react";
import LogoLink from "./LogoLink";
import { usePathname } from "next/navigation";
import Nav from "./Nav";
import { useScrollContext } from "@utils/context/ScrollContext";
import { useNavigation } from "@utils/context/NavigationContext";
import { MenuItem, menuItems } from "@assets/data/menuItems";
import { updateMenuClasses } from "@utils/updateMenuUtils";
import { useSmoothScroll } from "@utils/useSmoothScroll";
import { useInitialScroll } from "@utils/scrollUtils";
import { makeClickHandler } from "@utils/handlers";

interface NavProps {
    menuItems: MenuItem[];
    onNavigationClick: (path: string) => void;
}

const Header: React.FC<NavProps> = () => {
    const pathname = usePathname();
    const { currentRoute, updateRoute, closeHamburgerMenu } = useNavigation();
    const { activeSection } = useScrollContext();

    useInitialScroll(pathname);

    const handleNavigationClick = useSmoothScroll(currentRoute, updateRoute);

    const handleLogoClick = useMemo(
        () =>
            makeClickHandler(() => {
                closeHamburgerMenu(200);
                handleNavigationClick("/#top");
            }),
        [closeHamburgerMenu, handleNavigationClick]
    );

    const updatedMenuItems = useMemo(
        () => updateMenuClasses(menuItems.mainLink, activeSection, currentRoute),
        [activeSection, currentRoute]
    );

    return (
        <div className="ha header">
            <LogoLink onClick={handleLogoClick} />
            <Nav menuItems={updatedMenuItems} onNavigationClick={handleNavigationClick} />
        </div>
    );
};

export default memo(Header);
