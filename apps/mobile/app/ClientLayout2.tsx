import type { FC, ReactNode } from "react";
import ScrollSectionsWrapper from "./ScrollSectionsWrapper";
import ScrollProvider from "../src/utils/context/ScrollContext";

type ClientLayout2Props = {
    readonly children: ReactNode;
};

const ClientLayout2: FC<ClientLayout2Props> = ({ children }) => (
    <ScrollProvider>
        <ScrollSectionsWrapper>{children}</ScrollSectionsWrapper>
    </ScrollProvider>
);

export default ClientLayout2;
