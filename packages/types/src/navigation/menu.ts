export interface NavigationSubItem {
    id: string;
    title: string;
    AnchorId: string;
    class: string;
}

export interface NavigationMenuItem {
    id: string;
    title: string;
    path: string;
    svg: string;
    class?: string;
    AnchorId?: string;
    subItems?: NavigationSubItem[];
}

export interface NavigationMenuLinks {
    mainLink: NavigationMenuItem[];
    search?: NavigationMenuItem[];
    reservation?: NavigationMenuItem[];
    connection?: NavigationMenuItem[];
}
