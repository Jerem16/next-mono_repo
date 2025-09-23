"use client";

import { NavigationProvider } from "@utils/context/NavigationContext";
import { Header } from "@src/features/navigation/index";

const HeaderProps = () => {
    return (
        <NavigationProvider>
            <Header />
        </NavigationProvider>
    );
};

export default HeaderProps;
