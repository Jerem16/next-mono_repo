// src/utils/initializeMenu.ts
import { attachContentToMenu } from "@src/features/navigation/data/utils/attachContent";
import { menuItems } from "@src/features/navigation/data/menuItems";
import { contentIndex } from "@src/features/navigation/data/content/index";

export function initializeMenuWithContent() {
    return attachContentToMenu(menuItems, contentIndex);
}
