import HeaderLazy from "../src/components/header/HeaderLazy";
import ClientLayout from "./ClientLayout";
import dynamic from "next/dynamic";

const NavigationProvider = dynamic(() =>
    import("../src/utils/context/NavigationContext").then(
        (mod) => mod.NavigationProvider
    )
);

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr-FR">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link rel="preload" href="/img/retroviseur.svg" as="image" />

                <link rel="preload" href="/css/globals.css" as="style" />
                <link rel="stylesheet" href="/css/globals.css" fetchPriority="high" />

                <link rel="preload" href="/css/mobileDefer.css" as="style" />
                <link rel="stylesheet" href="/css/mobileDefer.css" fetchPriority="low" />
            </head>
            <body id="top">
                <NavigationProvider>
                    <ClientLayout>
                        <header>
                            <div className="content-wrapper">
                                <HeaderLazy />
                            </div>
                        </header>
                        <main>{children}</main>
                    </ClientLayout>
                </NavigationProvider>
            </body>
        </html>
    );
}
