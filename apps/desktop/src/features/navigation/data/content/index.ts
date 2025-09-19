import { sliderContent } from "./slider";
import { sliderInfo } from "./info";
import { aboutContent } from "./about";
import { serviceContent } from "./services";
import { contactAnnouncements, socialLinks, contactDetails } from "./contact";

import { Content } from "@src/features/navigation/types/content";

export const contentIndex: Record<string, Content[]> = {
    "#slider": [...sliderContent, ...sliderInfo],
    "#about": aboutContent,
    "#services": serviceContent,
    "#contact": [...contactAnnouncements, ...contactDetails, ...socialLinks],
};
