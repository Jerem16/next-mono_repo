import type { MenuItem } from "@assets/data/interfaces/menu";
import type { ExternalActionMap, MenuAction } from "./types";

/**
 * Convertit un MenuItem en MenuAction selon la priorité définie.
 */
export function toAction(item: MenuItem, external: ExternalActionMap): MenuAction {
    if (item.subItems && item.subItems.length > 0) {
        return { kind: "toggle", itemId: item.id };
    }

    if (external[item.id]) {
        return { kind: "externalClick", handlerId: item.id };
    }

    if (item.path && item.AnchorId) {
        return { kind: "href", href: `${item.path}${item.AnchorId}` };
    }

    if (item.AnchorId) {
        return {
            kind: "hash",
            targetId: item.AnchorId.replace(/^#/, ""),
            offset: item.scrollOffset,
        };
    }

    if (item.path) {
        return { kind: "href", href: item.path };
    }

    return { kind: "toggle", itemId: item.id };
}
