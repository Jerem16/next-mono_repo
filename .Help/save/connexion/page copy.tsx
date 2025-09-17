import { Metadata } from "next";
import Authentication from "@src/app/Authentication/Authentication";
import ProfileForm from "@components/Profile/UserProfileManager";
import UserNameManager from "@components/Profile/UserNameManager";
import AuthProvider from "@src/app/Authentication/auth-provider";
import SectionContainer from "../blog/SectionContainer";
import ConnectionIcon from "@components/svg_Icon/Connection";
// Exemple si tu utilises Amplify Authenticator
import { useAuthenticator } from "@aws-amplify/ui-react";

export const metadata: Metadata = {
    title: "Connexion",
    alternates: {
        canonical: "https://peur-de-la-conduite.fr/connexion",
        media: {
            "only screen and (max-width: 900px)": "https://mobile.peur-de-la-conduite.fr/connexion",
            "only screen and (min-width: 900px)":
                "https://desktop.peur-de-la-conduite.fr/connexion",
        },
    },
};

function PageContent() {
    const { user } = useAuthenticator((context) => [context.user]); // récupère user

    if (!user) {
        // utilisateur non connecté => afficher la section connexion
        return (
            <section className="section" id="connexion">
                <div className="fixed-menu"></div>
                <div className="fixed-menu"></div>
                <Authentication />
            </section>
        );
    }

    // utilisateur connecté => afficher l’espace perso
    return (
        <AuthProvider>
            <SectionContainer id="profile" title="Espace personnel" icon={<ConnectionIcon />}>
                <div className="post-content__content">
                    <UserNameManager />
                    <ProfileForm />
                </div>
            </SectionContainer>
        </AuthProvider>
    );
}

export default function Page() {
    return (
        <AuthProvider>
            <PageContent />
        </AuthProvider>
    );
}
