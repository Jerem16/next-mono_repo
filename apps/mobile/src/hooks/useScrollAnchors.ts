"use client";
import { useEffect } from "react";
import { useScrollContext } from "../utils/context/ScrollContext";
import { scrollInView, addNewUrl, updateSectionClasses } from "../utils/sections";
import { rafThrottle } from "../utils/rafThrottle";
import type {
    ScrollWorkerData,
    ScrollWorkerResponse,
    SectionPosition,
} from "../workers/scrollWorker";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useScrollAnchors = (_sections: { id: string }[]) => {
    const { setActiveSection } = useScrollContext();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const worker = new Worker(new URL("../workers/scrollWorker.js", import.meta.url));

        let currentSections: { id: string }[] = [];

        const handleScroll = () => {
            const nodes = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
            currentSections = nodes.map((el) => ({ id: el.id }));
            const positions = currentSections.reduce<Record<string, SectionPosition>>(
                (acc, { id }) => {
                    const section = document.getElementById(id);
                    if (section) {
                        acc[id] = {
                            top: section.offsetTop,
                            height: section.offsetHeight,
                        };
                    }
                    return acc;
                },
                {}
            );

            const data: ScrollWorkerData = {
                sections: currentSections,
                scrollY: window.scrollY,
                positions,
            };
            worker.postMessage(data);
        };

        worker.onmessage = (event: MessageEvent<ScrollWorkerResponse>) => {
            const { currentSectionId } = event.data;
            if (currentSectionId) {
                scrollInView(currentSections);
                addNewUrl(currentSectionId);
                updateSectionClasses(currentSections, setActiveSection);
            }
        };

        const controller = new AbortController();
        const throttledScroll = rafThrottle(handleScroll);

        handleScroll();
        window.addEventListener("scroll", throttledScroll, {
            passive: true,
            signal: controller.signal,
        });

        return () => {
            controller.abort();
            throttledScroll.cancel();
            worker.terminate();
        };
    }, [setActiveSection]);
};
