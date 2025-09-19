
import { useContext } from "react";

export const createUseContext = <T,>(
    context: React.Context<T | undefined>,
    name: string
): (() => T) => {
    return () => {
        const ctx = useContext(context);
        if (ctx === undefined) {
            throw new Error(
                `${name} must be used within a ${name.replace(
                    "use",
                    ""
                )}Provider`
            );
        }

        return ctx as T;
    };
};
