import { Metadata } from "next";
import Authentication from "@src/app/Authentication/Authentication";
import ProfileForm from "@components/Profile/UserProfileManager";
import UserNameManager from "@components/Profile/UserNameManager";
import AuthProvider from "@src/app/Authentication/auth-provider";
import SectionContainer from "../blog/SectionContainer";
import ConnectionIcon from "@components/svg_Icon/Connection";

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

export default async function Page() {
    return (
        <>
            <section className="section" id="connection">
                <div className="fixed-menu"></div>
                <div className="fixed-menu"></div>
                <Authentication />;
            </section>
            <AuthProvider>
                <SectionContainer id="profile" title="Espace personnel" icon={<ConnectionIcon />}>
                    <div className="post-content__content">
                        <UserNameManager />
                        <ProfileForm />
                    </div>
                </SectionContainer>
            </AuthProvider>
        </>
    );
}
