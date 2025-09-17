import "./globals.scss";
import { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="fr">
            <body>{children}</body>
        </html>
    );
}
