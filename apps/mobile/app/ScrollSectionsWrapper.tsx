"use client";
import type { ReactNode } from "react";

import { useScrollAnchors, MobileNavigationData } from "@packages/ui";

type ScrollSectionsWrapperProps = {
    children: ReactNode;
};

const ScrollSectionsWrapper = ({ children }: ScrollSectionsWrapperProps) => {
    useScrollAnchors(MobileNavigationData.sections);
    return <>{children}</>;
};
export default ScrollSectionsWrapper;
