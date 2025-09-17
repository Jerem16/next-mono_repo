import { useCallback } from "react";
import { handleScrollClick } from "./scrollSmooth";
import { handleNavClick } from "./nav";

export const useSmoothScroll = (
    currentRoute: string | undefined,
    updateRoute: (route: string) => void
) => {
    return useCallback(
        (path: string) => {
            handleNavClick(path, currentRoute, updateRoute, handleScrollClick);
        },
        [currentRoute, updateRoute]
    );
};
