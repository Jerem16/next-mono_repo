import { useEffect } from "react";
import { scrollToId } from "./scrollToId";

/**
 * Hook déclenchant un scroll vers l'ancre courante et suivant les changements de hash.
 */
export function useHashScroll(offset = 0): void {
    useEffect(() => {
        const handle = () => {
            const hash = window.location.hash.replace(/^#/, "");
            if (hash) scrollToId(hash, offset);
        };

        handle();
        window.addEventListener("hashchange", handle);
        window.addEventListener("popstate", handle);
        return () => {
            window.removeEventListener("hashchange", handle);
            window.removeEventListener("popstate", handle);
        };
    }, [offset]);
}
