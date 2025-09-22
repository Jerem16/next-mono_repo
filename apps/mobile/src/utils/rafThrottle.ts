export function rafThrottle<T extends (...args: unknown[]) => void>(fn: T) {
    let rafId: number | null = null;
    const throttled = (...args: Parameters<T>) => {
        if (rafId !== null) return;
        rafId = requestAnimationFrame(() => {
            fn(...args);
            rafId = null;
        });
    };
    throttled.cancel = () => {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };
    return throttled;
}
