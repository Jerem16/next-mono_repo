import { MenuLinks } from "./interfaces/menu";
import { contentIndex } from "./content/index";

export const menuItems: MenuLinks = {
    mainLink: [
        {
            id: "menu-home",
            title: "Accueil",
            class: "",
            path: "/",
            AnchorId: "#slider",
            svg: "Home",
            subItems: [
                {
                    id: "menu-slider",
                    title: "Slider",
                    AnchorId: "#slider",
                    class: "",
                    content: contentIndex["#slider"],
                },
                {
                    id: "menu-about",
                    title: "À propos",
                    AnchorId: "#about",
                    class: "",
                    content: contentIndex["#about"],
                },
                {
                    id: "menu-services",
                    title: "Services",
                    AnchorId: "#services",
                    class: "",
                },
                {
                    id: "menu-contact",
                    title: "Contact",
                    AnchorId: "#contact",
                    class: "",
                },
            ],
        },
        {
            id: "menu-services",
            title: "Services",
            class: "",
            path: "/services",
            AnchorId: "#top",
            svg: "Services",
            scrollOffset: 102,
            subItems: [
                {
                    id: "menu-without-license",
                    title: "Sans Permis",
                    AnchorId: "#sans-permis",
                    class: "",
                    scrollOffset: 102,
                },
                {
                    id: "menu-with-license",
                    title: "Avec Permis",
                    AnchorId: "#avec-permis",
                    class: "",
                    scrollOffset: 102,
                },
            ],
        },
        {
            id: "menu-prices",
            title: "Tarifs",
            class: "",
            path: "/tarifs",
            AnchorId: "#top",
            svg: "Tarifs",
            scrollOffset: 102,
            subItems: [
                {
                    id: "menu-without-license",
                    title: "Débutant",
                    AnchorId: "#novice",
                    class: "",
                    scrollOffset: 102,
                },
                {
                    id: "menu-with-license",
                    title: "Confirmé",
                    AnchorId: "#expert",
                    class: "",
                    scrollOffset: 102,
                },
            ],
        },
        {
            id: "menu-blog",
            title: "Blog",
            class: "",
            path: "/blog",
            AnchorId: "#top",
            svg: "Blog",
        },
        {
            id: "menu-contact",
            title: "Contact",
            class: "",
            path: "/contact",
            AnchorId: "#top",
            svg: "Contact",
        },
    ],
    reservation: [
        {
            id: "reservationId",
            title: "Réservation",
            class: "",
            path: "/reservation",
            AnchorId: "#top",
            svg: "Reservation",
        },
    ],
    search: [
        {
            id: "search",
            title: "Rechercher ...",
            class: "",
            path: "/search",
            AnchorId: "#top",
            svg: "Search",
        },
    ],
    connection: [
        {
            id: "connexion",
            title: "Connexion",
            class: "",
            path: "/connexion", // au lieu de /connection
            AnchorId: "#top",
            svg: "Connection", // tu peux laisser, ou renommer plus tard
            subItems: [
                {
                    id: "profil",
                    title: "Mon profil", // <- le lien vers la section profil
                    AnchorId: "#profile", // ou "#profil" si tu FR-ises l’ID
                    class: "",
                    scrollOffset: 102,
                },
            ],
        },
    ],
};

export type { MenuItem } from "./interfaces/menu";
