import ScrollSectionsWrapper from "./ScrollSectionsWrapper";
import ScrollProvider from "../src/utils/context/ScrollContext";

const ClientLayout2 = ({ children }: { children: React.ReactNode }) => {
    return (
        <ScrollProvider>
            <ScrollSectionsWrapper>{children}</ScrollSectionsWrapper>
        </ScrollProvider>
    );
};

export default ClientLayout2;
