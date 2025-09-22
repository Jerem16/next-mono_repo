// eslint.config.mjs (RACINE)
import { fileURLToPath } from "node:url";
import path from "node:path";
import makeNextConfig from "./packages/eslint-config/next.js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const tsconfigRootDir = path.dirname(fileURLToPath(new URL("./package.json", import.meta.url)));

export default [
    // Ignorés globalement
    {
        ignores: [
            "**/*.d.ts",
            "**/dist/**",
            "**/.next/**",
            "**/node_modules/**",
            "**/eslint.config.js",
            "apps/*/next-env.d.ts",
            "apps/*/next.config.ts",
        ],
    },

    // ✅ Preset Next (core-web-vitals) pour TOUTES les apps
    ...makeNextConfig({
        apps: [
            {
                name: "admin",
                tsconfig: "./apps/admin/tsconfig.json",
                include: ["apps/admin/{app,src}/**/*.{ts,tsx}"],
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
            {
                name: "main",
                tsconfig: "./apps/main/tsconfig.json",
                include: ["apps/main/{app,src}/**/*.{ts,tsx}"],
            },
        ],
    }),

    // 🔧 apps/* : parser TS type-aware + resolver TS + règles communes
    {
        files: ["apps/*/{app,src}/**/*.{ts,tsx}"],
        plugins: {
            import: importPlugin,
            "@typescript-eslint": tseslint.plugin,
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: [
                    "./apps/admin/tsconfig.json",
                    "./apps/desktop/tsconfig.json",
                    "./apps/mobile/tsconfig.json",
                    "./apps/main/tsconfig.json",
                    "./packages/types/tsconfig.json",
                    "./packages/domain/tsconfig.json",
                    "./packages/services/tsconfig.json",
                    "./packages/ui/tsconfig.json",
                ],
                tsconfigRootDir,
                projectService: true,
                noWarnOnMultipleProjects: true,
            },
        },
        settings: {
            "import/resolver": {
                typescript: {
                    alwaysTryTypes: true,
                    project: [
                        "./apps/admin/tsconfig.json",
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
            next: { rootDir: ["apps/admin/", "apps/desktop/", "apps/mobile/", "apps/main/"] },
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
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
        },
    },

    // 🔧 packages/* : parser TS type-aware + resolver TS
    {
        files: ["packages/**/*.{ts,tsx}"],
        plugins: {
            import: importPlugin,
            "@typescript-eslint": tseslint.plugin,
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
        },
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
                projectService: true,
                noWarnOnMultipleProjects: true,
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
            react: { version: "detect" },
        },
        rules: {
            "import/no-unresolved": "error",
        },
    },
];
