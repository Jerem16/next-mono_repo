// src/utils/handlers.ts

/* ---------- Types & helpers ---------- */

export type MinimalEvent = {
    preventDefault(): void;
    stopPropagation(): void;
    key?: string;
};

export const stopAndPrevent = (e: MinimalEvent) => {
    e.preventDefault();
    e.stopPropagation();
};

export const isActivationKey = (e: MinimalEvent) => e.key === "Enter" || e.key === " ";

/** Gate prêt à l'emploi : ne passe que Enter/Espace */
export const onlyActivation =
    (keys: readonly string[] = ["Enter", " "]) =>
    (e: MinimalEvent) =>
        typeof e.key === "string" && keys.includes(e.key);

/* ---------- Debounce typé (aucun any) ---------- */

export type Debounced<A extends unknown[]> = ((...args: A) => void) & {
    cancel: () => void;
    pending: () => boolean;
};

/** @__PURE__  Exécute `fn` après `wait` ms d'inactivité (trailing-only). */
export function debounce<A extends unknown[]>(fn: (...args: A) => void, wait = 100): Debounced<A> {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: A | null = null;

    const debounced = ((...args: A) => {
        lastArgs = args;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            const argsToUse = lastArgs as A; // défini ici
            lastArgs = null;
            fn(...argsToUse);
        }, wait);
    }) as Debounced<A>;

    debounced.cancel = () => {
        if (timer) clearTimeout(timer);
        timer = null;
        lastArgs = null;
    };

    debounced.pending = () => timer !== null;

    return debounced;
}

/* ---------- Fabrique pluripotente & tree-shakeable ---------- */

type BaseOpts = {
    /** Fermer après exécution (ex: menu) */
    close?: (delay?: number) => void;
    /** Délai passé à close() */
    delay?: number;
    /** Debounce en ms (0 pour désactiver). Par défaut 100 */
    debounceMs?: number;
    /** Filtre d’event : si false -> ne déclenche pas */
    gate?: (e: MinimalEvent) => boolean;
    /** stop+prevent par défaut (true). Mettre false pour gérer soi-même */
    stopPrevent?: boolean;
    /** Hook avant exécution (ex: e.preventDefault() clavier) */
    before?: (e: MinimalEvent) => void;
    /** Hook après exécution */
    after?: (e: MinimalEvent) => void;
};

type WithPayload = BaseOpts & { withPayload: true };
type NoPayload = BaseOpts & { withPayload?: false | undefined };

/* ---- Overloads ergonomiques ---- */
export function makeHandler(run: () => void, opts?: NoPayload): (e: MinimalEvent) => void;
export function makeHandler<P>(
    run: (payload: P) => void,
    opts: WithPayload
): (payload: P, e: MinimalEvent) => void;

/* ---- Implémentation unique ---- */
export function makeHandler<P>(
    run: ((payload: P) => void) | (() => void),
    opts?: WithPayload | NoPayload
) {
    const wait = opts?.debounceMs ?? 100;
    const gate = opts?.gate ?? (() => true);
    const useStopPrevent = opts?.stopPrevent ?? true;

    if ((opts as WithPayload)?.withPayload) {
        // Variante avec payload
        const fire =
            wait === 0
                ? (payload: P) => {
                      (run as (p: P) => void)(payload);
                      opts?.close?.(opts?.delay);
                  }
                : debounce<[P]>((payload: P) => {
                      (run as (p: P) => void)(payload);
                      opts?.close?.(opts?.delay);
                  }, wait);

        return (payload: P, e: MinimalEvent) => {
            if (useStopPrevent) stopAndPrevent(e);
            if (!gate(e)) return;
            opts?.before?.(e);
            fire(payload);
            opts?.after?.(e);
        };
    }

    // Variante sans payload
    const fire0 =
        wait === 0
            ? () => {
                  (run as () => void)();
                  opts?.close?.(opts?.delay);
              }
            : debounce<[]>(() => {
                  (run as () => void)();
                  opts?.close?.(opts?.delay);
              }, wait);

    return (e: MinimalEvent) => {
        if (useStopPrevent) stopAndPrevent(e);
        if (!gate(e)) return;
        opts?.before?.(e);
        fire0();
        opts?.after?.(e);
    };
}

/* ---------- Wrappers minces (API compat, tree-shakeables) ---------- */

type HandlerOpts = Omit<BaseOpts, "withPayload">;

/** Clic générique (debounce 100ms par défaut) */
export const makeClickHandler = (run: () => void, opts?: HandlerOpts) => makeHandler(run, opts);

/** Clic avec payload (ex: path) */
export const makePayloadClickHandler = <P>(run: (payload: P) => void, opts?: HandlerOpts) =>
    makeHandler<P>(run, { ...opts, withPayload: true });

/** Clavier : déclenche uniquement sur Entrée/Espace */
export const makeActivationHandler = <P>(run: (payload: P) => void, opts?: HandlerOpts) =>
    makeHandler<P>(run, {
        ...opts,
        withPayload: true,
        gate: opts?.gate ?? onlyActivation(),
        stopPrevent: false, // comme avant: pas de stopPropagation forcé
        before: (e) => e.preventDefault?.(),
    });
