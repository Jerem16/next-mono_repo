export type ToggleAction = {
    kind: "toggle";
    itemId: string;
};

export type HrefAction = {
    kind: "href";
    href: string;
};

export type HashAction = {
    kind: "hash";
    targetId: string;
    offset?: number;
};

export type ExternalClickAction = {
    kind: "externalClick";
    handlerId: string;
};

export type MenuAction = ToggleAction | HrefAction | HashAction | ExternalClickAction;

export type ExternalActionMap = Record<string, () => void>;
