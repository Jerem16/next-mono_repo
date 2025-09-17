import type { MenuItem, SubItem } from "@assets/data/interfaces/menu";

/**
 * Détermine l'offset de défilement à appliquer.
 * Priorité : MenuItem > SubItem > 0.
 */
export function resolveScrollOffset(
    menuItem?: Pick<MenuItem, "scrollOffset">,
    subItem?: Pick<SubItem, "scrollOffset">
): number {
    if (typeof menuItem?.scrollOffset === "number") {
        return menuItem.scrollOffset;
    }
    if (typeof subItem?.scrollOffset === "number") {
        return subItem.scrollOffset;
    }
    return 0;
}
