export interface ScrollSmoothWorkerData {
    start: number;
    end: number;
    duration: number;
    startTime: number;
    currentTime: number;
}

export interface ScrollSmoothWorkerResponse {
    newScrollY: number;
    progress: number;
}
