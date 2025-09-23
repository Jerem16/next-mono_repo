"use client";

import { createContext, useMemo, useState, type ReactNode } from "react";

import { createUseContext } from "./createUseContext";

interface ScrollContextType {
    activeSection: string;
    setActiveSection: (section: string) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

interface ScrollProviderProps {
    children: ReactNode;
}

export const ScrollProvider = ({ children }: ScrollProviderProps) => {
    const [activeSection, setActiveSection] = useState<string>("");

    const contextValue = useMemo(
        () => ({ activeSection, setActiveSection }),
        [activeSection]
    );

    return (
        <ScrollContext.Provider value={contextValue}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScrollContext = createUseContext(
    ScrollContext,
    "useScrollContext"
);
