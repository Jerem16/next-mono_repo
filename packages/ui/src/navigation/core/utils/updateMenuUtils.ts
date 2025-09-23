import type { NavigationMenuItem, NavigationSubItem } from "@packages/types";

const isMainItemActive = (itemPath: string, currentRoute: string): boolean => {
    if (itemPath === "/") {
        return currentRoute === "/" || currentRoute.startsWith("/#");
    }
    return currentRoute.startsWith(itemPath);
};

const mapSubItems = (
    subItems: ReadonlyArray<NavigationSubItem>,
    activeSection: string
): NavigationSubItem[] =>
    subItems.map((sub) => ({
        ...sub,
        class: sub.AnchorId === `#${activeSection}` ? "active" : "",
    }));

export const updateMenuClasses = (
    mainLink: ReadonlyArray<NavigationMenuItem> = [],
    activeSection = "",
    currentRoute = ""
) => ({
    mainLink: mainLink.map((item) => ({
        ...item,
        class: isMainItemActive(item.path, currentRoute) ? "active" : "",
        subItems: item.subItems ? mapSubItems(item.subItems, activeSection) : undefined,
    })),
});
