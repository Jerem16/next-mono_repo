"use client";
import type { ReactNode } from "react";
import { useScrollAnchors } from "../src/hooks/useScrollAnchors";
import { sections } from "../src/assets/data/sections";

type ScrollSectionsWrapperProps = {
    children: ReactNode;
};

const ScrollSectionsWrapper = ({ children }: ScrollSectionsWrapperProps) => {
    useScrollAnchors(sections);
    return <>{children}</>;
};
export default ScrollSectionsWrapper;
