"use client";
import { useEffect } from "react";
import { useScrollContext } from "../context/ScrollProvider";
import { addNewUrl, scrollInView, updateSectionClasses } from "../utils/sections";
import { rafThrottle } from "../utils/rafThrottle";
import { measureAnchors } from "../utils/positions";
import type { Section } from "@packages/types";
import type {
    ScrollWorkerData,
    ScrollWorkerResponse,
    SectionPosition,
} from "../workers/scrollWorker";

export const useScrollAnchors = (sections: ReadonlyArray<Section>) => {
    const { setActiveSection } = useScrollContext();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const worker = new Worker(new URL("../workers/scrollWorker.js", import.meta.url));

        let currentSections: { id: string }[] = [];

        const handleScroll = () => {
            const anchors = measureAnchors(sections);
            currentSections = anchors.map(({ id }) => ({ id }));
            const positions = anchors.reduce<Record<string, SectionPosition>>((acc, anchor) => {
                acc[anchor.id] = { top: anchor.top, height: anchor.height };
                return acc;
            }, {});

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
    }, [sections, setActiveSection]);
};
