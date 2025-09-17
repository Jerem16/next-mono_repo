import { scrollToId } from "../scroll/scrollToId";
import type { ExternalActionMap, MenuAction } from "./types";

/**
 * Exécute une MenuAction.
 */
export function dispatch(action: MenuAction, external: ExternalActionMap): void {
    switch (action.kind) {
        case "href":
            window.location.assign(action.href);
            break;
        case "hash":
            scrollToId(action.targetId, action.offset);
            break;
        case "externalClick":
            external[action.handlerId]?.();
            break;
        case "toggle":
        default:
            // La logique de toggle est gérée par le code legacy
            break;
    }
}
