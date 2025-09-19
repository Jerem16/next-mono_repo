
import { useContext } from "react";

export const createUseContext = <T,>(
    context: React.Context<T | null | undefined>,
    name: string
) => {
    return () => {
        const ctx = useContext(context);
        if (ctx == null) {
            throw new Error(
                `${name} must be used within a ${name.replace(
                    "use",
                    ""
                )}Provider`
            );
        }

        return ctx;
    };
};
