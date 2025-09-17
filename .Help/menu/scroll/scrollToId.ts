/**
 * Fait défiler la page jusqu'à l'élément correspondant à l'ID fourni.
 * Attendre la disponibilité de l'élément avec `requestAnimationFrame` avant de déclencher le scroll.
 * Respecte `prefers-reduced-motion` et applique `focus({ preventScroll: true })`.
 */
export function scrollToId(id: string, offset = 0): void {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function attempt(): void {
        const el = document.getElementById(id);
        if (!el) {
            window.requestAnimationFrame(attempt);
            return;
        }

        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        const behavior: ScrollBehavior = prefersReducedMotion ? "auto" : "smooth";
        window.scrollTo({ top, behavior });

        if (el instanceof HTMLElement) {
            el.focus({ preventScroll: true });
        }
    }

    window.requestAnimationFrame(attempt);
}
