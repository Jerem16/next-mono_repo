// ScrollSectionsWrapper.js
"use client";

import React from "react";
import { useScrollAnchors } from "@src/features/navigation/utils/scrollUtils";
import { sections } from "@src/features/navigation/data/sections";

const ScrollSectionsWrapper = ({ children }) => {
    useScrollAnchors(sections);
    return <>{children}</>;
};

export default ScrollSectionsWrapper;
