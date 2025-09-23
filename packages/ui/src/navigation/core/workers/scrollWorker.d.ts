export interface SectionPosition {
    top: number;
    height: number;
}

export interface ScrollWorkerData {
    sections: { id: string }[];
    scrollY: number;
    positions: Record<string, SectionPosition>;
}

export interface ScrollWorkerResponse {
    currentSectionId: string;
}
