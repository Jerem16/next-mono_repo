import { useState, useEffect } from "react";
import useIsBrowser from "@src/features/navigation/utils/useIsBrowser";

function isValueCompatibleWithInitial<T>(value: unknown, initialValue: T): value is T {
    if (initialValue === null) {
        return value === null;
    }

    if (Array.isArray(initialValue)) {
        return Array.isArray(value);
    }

    if (typeof initialValue === "object") {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }

    return typeof value === typeof initialValue;
}

function parseStoredValue<T>(item: string | null, initialValue: T): T {
    if (item === null) {
        return initialValue;
    }

    try {
        const parsedValue: unknown = JSON.parse(item);
        if (isValueCompatibleWithInitial(parsedValue, initialValue)) {
            return parsedValue;
        }
    } catch {
        // Intentionally swallow the error and fall back to the initial value.
    }

    return initialValue;
}

export default function useSessionStorage<T>(key: string, initialValue: T) {
    const isBrowser = useIsBrowser();

    const [storedValue, setStoredValue] = useState<T>(() => {
        if (!isBrowser) {
            return initialValue;
        }

        const item = sessionStorage.getItem(key);
        return parseStoredValue(item, initialValue);

    });

    useEffect(() => {
        if (isBrowser) {
            sessionStorage.setItem(key, JSON.stringify(storedValue));
        }
    }, [key, storedValue, isBrowser]);

    return [storedValue, setStoredValue] as const;
}
// //* const [name, setName] = useSessionStorage<string>("name", "Jérémy");
