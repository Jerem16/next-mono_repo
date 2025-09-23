import type { ReactNode } from "react";

import dynamic from "next/dynamic";
const LazyClientLayout = dynamic(() => import("./ClientLayout2"));

const ClientLayout = ({ children }: { children: ReactNode }) => {
    return <LazyClientLayout>{children}</LazyClientLayout>;
};

export default ClientLayout;
