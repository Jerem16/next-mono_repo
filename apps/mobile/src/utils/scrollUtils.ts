"use client";
import { useEffect } from "react";
import { handleScrollClick } from "./scrollSmooth";
export const useInitialScroll = (pathname: string | null) => {
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (window.location.hash) {
            window.scrollTo({ top: 0 });
            handleScrollClick(window.location.hash.substring(1));
        }
    }, [pathname]);
};
