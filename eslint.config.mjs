// eslint.config.mjs (RACINE)
import { fileURLToPath } from "node:url";
import path from "node:path";
import makeNextConfig from "./packages/eslint-config/next.js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

const tsconfigRootDir = path.dirname(fileURLToPath(new URL("./package.json", import.meta.url)));

export default [
    // Ignorés globalement
    {
        ignores: [
            "**/dist/**",
            "**/.next/**",
            "**/node_modules/**",
            "**/eslint.config.js",
        ],
    },

    // ✅ Preset Next + React + TS (core-web-vitals SANS modification)
    // (Ton package interne applique déjà @next/eslint-plugin-next core-web-vitals
    // et désactive seulement no-html-link-for-pages pour l’App Router)
    ...makeNextConfig({
        apps: [
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
            {
                name: "main",
                tsconfig: "./apps/main/tsconfig.json",
                include: ["apps/main/{app,src}/**/*.{ts,tsx}"],
            },
        ],
    }),

    // 🔧 CIBLE apps/* : parser TS type-aware + resolver TS
    {
        files: ["apps/*/{app,src}/**/*.{ts,tsx}"],
        plugins: { import: importPlugin },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: [
                    "./apps/desktop/tsconfig.json",
                    "./apps/mobile/tsconfig.json",
                    "./apps/main/tsconfig.json",
                    "./packages/types/tsconfig.json",
                    "./packages/domain/tsconfig.json",
                    "./packages/services/tsconfig.json",
                    "./packages/ui/tsconfig.json",
                ],
                tsconfigRootDir,
            },
        },
        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: [
                        "./apps/desktop/tsconfig.json",
                        "./apps/mobile/tsconfig.json",
                        "./apps/main/tsconfig.json",
                        "./packages/types/tsconfig.json",
                        "./packages/domain/tsconfig.json",
                        "./packages/services/tsconfig.json",
                        "./packages/ui/tsconfig.json",
                    ],
                },
            },
            next: { rootDir: ["apps/desktop/", "apps/mobile/", "apps/main/"] },
            react: { version: "detect" },
        },
        rules: {
            "react/jsx-no-undef": "error",
            "react/react-in-jsx-scope": "off",
            "import/no-unresolved": "error",
            "@typescript-eslint/no-unsafe-call": "warn",
            "@typescript-eslint/no-unsafe-member-access": "warn",
            "@typescript-eslint/no-unsafe-assignment": "warn",
            "@typescript-eslint/no-unsafe-return": "warn",
            "@typescript-eslint/no-redundant-type-constituents": "warn",
        },
    },

    // 🔧 packages : type-aware strict
    {
        files: ["packages/**/*.{ts,tsx}"],
        plugins: { import: importPlugin }, // ❌ pas de "@typescript-eslint" ici non plus
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: [
                    "./packages/domain/tsconfig.json",
                    "./packages/services/tsconfig.json",
                    "./packages/types/tsconfig.json",
                    "./packages/ui/tsconfig.json",
                ],
                tsconfigRootDir,
            },
        },
        settings: {
            "import/resolver": {
                typescript: {
                    project: [
                        "./packages/domain/tsconfig.json",
                        "./packages/services/tsconfig.json",
                        "./packages/types/tsconfig.json",
                        "./packages/ui/tsconfig.json",
                    ],
                },
            },
        },
        rules: {
            "import/no-unresolved": "error",
        },
    },
];
