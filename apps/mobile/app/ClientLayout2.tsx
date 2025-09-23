import type { ReactNode } from "react";

import { ScrollProvider } from "@packages/ui";
import ScrollSectionsWrapper from "./ScrollSectionsWrapper";

const ClientLayout2 = ({ children }: { children: ReactNode }) => {
    return (
        <ScrollProvider>
            <ScrollSectionsWrapper>{children}</ScrollSectionsWrapper>
        </ScrollProvider>
    );
};

export default ClientLayout2;
