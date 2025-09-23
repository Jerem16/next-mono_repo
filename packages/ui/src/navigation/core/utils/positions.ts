"use client";
import type { Section } from "@packages/types";

export interface AnchorPosition {
    id: string;
    top: number;
    height: number;
}

export function measureAnchors(
    sections: ReadonlyArray<Section>
): ReadonlyArray<AnchorPosition> {
    const out: AnchorPosition[] = [];
    for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) {
            continue;
        }
        const rect = element.getBoundingClientRect();
        const top = Math.max(0, rect.top + window.scrollY - (section.offset ?? 0));
        out.push({ id: section.id, top, height: rect.height });
    }
    return out.sort((a, b) => a.top - b.top);
}
