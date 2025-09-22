// packages/eslint-config/next.js
import { fileURLToPath } from "node:url";
import path from "node:path";
import nextPlugin from "@next/eslint-plugin-next";
import { config as reactConfig } from "./react-internal.js";

// /**
//  * makeNextConfig({
//  *   apps: [
//  *     { name: "admin",   tsconfig: "./apps/admin/tsconfig.json",   include: ["apps/admin/{app,src}/**/*.{ts,tsx}"] },
//  *     { name: "desktop", tsconfig: "./apps/desktop/tsconfig.json", include: ["apps/desktop/{app,src}/**/*.{ts,tsx}"] },
//  *     { name: "mobile",  tsconfig: "./apps/mobile/tsconfig.json",  include: ["apps/mobile/{app,src}/**/*.{ts,tsx}"] },
//  *     { name: "main",    tsconfig: "./apps/main/tsconfig.json",    include: ["apps/main/{app,src}/**/*.{ts,tsx}"] },
//  *   ]
//  * })
//  */
const tsconfigRootDir = path.dirname(fileURLToPath(new URL("../../package.json", import.meta.url)));
const nextRules = nextPlugin.configs["core-web-vitals"].rules;

export default function makeNextConfig({
    apps = [
        {
            name: "admin",
            tsconfig: "./apps/admin/tsconfig.json",
            include: ["apps/admin/{app,src}/**/*.{ts,tsx}"],
        },
        {
            name: "main",
            tsconfig: "./apps/main/tsconfig.json",
            include: ["apps/main/{app,src}/**/*.{ts,tsx}"],
        },
        {
            name: "desktop",
            tsconfig: "./apps/desktop/tsconfig.json",
            include: ["apps/desktop/{app,src}/**/*.{ts,tsx}"],
        },
        {
            name: "mobile",
            tsconfig: "./apps/mobile/tsconfig.json",
            include: ["apps/mobile/{app,src}/**/*.{ts,tsx}"],
        },
    ],
} = {}) {
    const blocks = [];

    // 1) Réutilise ta config React interne (JS/TSX générique)
    blocks.push(...reactConfig);

    // 2) Pour chaque app Next, injecte le plugin Next + règles core-web-vitals
    for (const app of apps) {
        const { name, tsconfig, include } = app;

        blocks.push({
            files: include,
            plugins: { "@next/next": nextPlugin },
            languageOptions: {
                // pas de parser ici : on applique juste les règles Next
                parserOptions: {
                    project: [tsconfig], // facultatif ici, mais inoffensif
                    tsconfigRootDir, // racine monorepo
                },
            },
            settings: {
                next: { rootDir: [`apps/${name}/`] }, // essentiel pour que Next "détecte" le plugin
            },
            rules: {
                ...nextRules,
                "@next/next/no-html-link-for-pages": "off",
                // Bruit TS souvent inutile côté app
                "@typescript-eslint/no-unsafe-call": "off",
                "@typescript-eslint/no-unsafe-member-access": "off",
                "@typescript-eslint/no-unsafe-return": "off",
                "@typescript-eslint/no-unsafe-assignment": "off",
            },
        });
    }

    return blocks;
}
