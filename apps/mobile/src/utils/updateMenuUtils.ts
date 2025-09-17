import type { MenuItem } from "../assets/data/menuItems";
import type { SubItem } from "../assets/data/interfaces/menu";

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
) => ({
    mainLink: mainLink.map((item) => ({
        ...item,
        class: isMainItemActive(item.path, currentRoute) ? "active" : "",
        subItems: item.subItems ? mapSubItems(item.subItems, activeSection) : undefined,
    })),
});
