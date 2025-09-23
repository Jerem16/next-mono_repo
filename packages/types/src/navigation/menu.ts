import type { RoutePath } from "./route";

export type AnchorHash = `#${string}`;

export interface NavigationSubItem {
    id: string;
    title: string;
    AnchorId: AnchorHash;
    class?: string;
}

export interface NavigationMenuItem {
    id: string;
    title: string;
    class?: string;
    path: RoutePath;
    svg?: string;
    AnchorId?: AnchorHash;
    subItems?: ReadonlyArray<NavigationSubItem>;
}

export interface NavigationMenu {
    mainLink: ReadonlyArray<NavigationMenuItem>;
    search?: ReadonlyArray<NavigationMenuItem>;
}
