export const modes = ["mobile", "tablet", "desktopReduced", "desktop"] as const;
export type MenuMode = (typeof modes)[number];
