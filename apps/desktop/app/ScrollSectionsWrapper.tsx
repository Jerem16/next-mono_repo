// ScrollSectionsWrapper.tsx
"use client";

import type { ReactNode } from "react";
import { useScrollAnchors } from "@src/features/navigation/utils/scrollUtils";
import { sections } from "@src/features/navigation/data/sections";

type ScrollSectionsWrapperProps = {
    children: ReactNode;
};

const ScrollSectionsWrapper = ({ children }: ScrollSectionsWrapperProps) => {
    useScrollAnchors(sections);
    return <>{children}</>;
};

export default ScrollSectionsWrapper;
