import type { MenuItem } from "../assets/data/menuItems";
import type { MenuLinks, SubItem } from "../assets/data/interfaces/menu";

const isMainItemActive = (itemPath: string, currentRoute: string): boolean => {
    if (itemPath === "/") {
        return currentRoute === "/" || currentRoute.startsWith("/#");
    }
    return currentRoute.startsWith(itemPath);
};

const mapSubItems = (subItems: SubItem[], activeSection: string): SubItem[] =>
    subItems.map((sub) => ({
        ...sub,
        class: sub.AnchorId === `#${activeSection}` ? "active" : "",
    }));

export const updateMenuClasses = (
    mainLink: MenuItem[] = [],
    activeSection = "",
    currentRoute = ""
): MenuLinks => ({
    mainLink: mainLink.map((item) => ({
        ...item,
        class: isMainItemActive(item.path, currentRoute) ? "active" : "",
        ...(item.subItems
            ? { subItems: mapSubItems(item.subItems, activeSection) }
            : {}),
    })),
});
