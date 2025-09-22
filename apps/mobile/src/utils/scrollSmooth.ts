import type {
    ScrollSmoothWorkerData,
    ScrollSmoothWorkerResponse,
} from "../workers/scrollSmoothWorker";

export const handleScrollClick = (targetId: string): void => {
    const element = document.getElementById(targetId);
    if (!element) return;
    const start = window.scrollY;
    const end = element.getBoundingClientRect().top + window.scrollY;
    const duration = 750;
    const startTime = performance.now();

    const worker = new Worker(new URL("../workers/scrollSmoothWorker.js", import.meta.url));

    const animateScroll = (currentTime: number): void => {
        const data: ScrollSmoothWorkerData = {
            start,
            end,
            duration,
            startTime,
            currentTime,
        };
        worker.postMessage(data);
    };

    worker.onmessage = (event: MessageEvent<ScrollSmoothWorkerResponse>): void => {
        const { newScrollY, progress } = event.data;
        window.scrollTo(0, newScrollY);
        if (progress < 1) {
            window.requestAnimationFrame(animateScroll);
        } else {
            worker.terminate();
        }
    };

    window.requestAnimationFrame(animateScroll);
};
