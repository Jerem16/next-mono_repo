"use client";
import { useScrollAnchors } from "../src/hooks/useScrollAnchors";
import { sections } from "../src/assets/data/sections";
import type { ReactNode } from "react";

type ScrollSectionsWrapperProps = {
    readonly children?: ReactNode;
};

const ScrollSectionsWrapper = ({ children }: ScrollSectionsWrapperProps) => {
    useScrollAnchors(sections);
    return <>{children}</>;
};

export default ScrollSectionsWrapper;
