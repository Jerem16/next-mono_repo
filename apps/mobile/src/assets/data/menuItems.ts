import { MenuLinks } from "./interfaces/menu";
export const menuItems: MenuLinks = {
    mainLink: [
        {
            id: "menu-home",
            title: "Accueil",
            class: "",
            path: "/",
            AnchorId: "#top",
            svg: "Home",
            subItems: [
                {
                    id: "menu-slider",
                    title: "Slider",
                    AnchorId: "#s1",
                    class: "",
                },
                {
                    id: "menu-about",
                    title: "À propos",
                    AnchorId: "#s2",
                    class: "",
                },
                {
                    id: "menu-services",
                    title: "Services",
                    AnchorId: "#s3",
                    class: "",
                },
                {
                    id: "menu-contact",
                    title: "Contact",
                    AnchorId: "#s4",
                    class: "",
                },
            ],
        },
        {
            id: "menu-services",
            title: "Services",
            class: "",
            path: "/p1",
            AnchorId: "#top",
            svg: "Services",
            subItems: [
                {
                    id: "menu-without-license",
                    title: "Sans Permis",
                    AnchorId: "#sans-permis",
                    class: "",
                },
                {
                    id: "menu-with-license",
                    title: "Avec Permis",
                    AnchorId: "#avec-permis",
                    class: "",
                },
            ],
        },
        {
            id: "menu-prices",
            title: "Tarifs",
            class: "",
            path: "/p2",
            AnchorId: "#top",
            svg: "Tarifs",
            subItems: [
                {
                    id: "menu-without-license",
                    title: "Débutant",
                    AnchorId: "#novice",
                    class: "",
                },
                {
                    id: "menu-with-license",
                    title: "Confirmé",
                    AnchorId: "#expert",
                    class: "",
                },
            ],
        },
        {
            id: "menu-blog",
            title: "Blog",
            class: "",
            path: "/p1",
            AnchorId: "#top",
            svg: "Blog",
        },
        {
            id: "menu-contact",
            title: "Contact",
            class: "",
            path: "/p2",
            AnchorId: "#expert",
            svg: "Contact",
        },
    ],
};

export type { MenuItem } from "./interfaces/menu";
