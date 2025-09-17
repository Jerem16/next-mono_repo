// eslint.config.mjs (ROOT)
import { fileURLToPath } from "node:url";
import path from "node:path";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react"; // ✅ NEW
import pluginReactHooks from "eslint-plugin-react-hooks"; // ✅ NEW

const tsconfigRootDir = path.dirname(fileURLToPath(new URL("./package.json", import.meta.url)));
const compat = new FlatCompat({ baseDirectory: tsconfigRootDir });

export default [
    // 0) Ignorés globaux
    {
        ignores: [
            "**/dist/**",
            "**/.next/**",
            "**/node_modules/**",
            "apps/web/next-env.d.ts",
            "apps/web/next.config.ts",
        ],
    },

    // 0bis) Enregistre les plugins UNE seule fois
    {
        plugins: {
            import: importPlugin,
            react: pluginReact,
            "react-hooks": pluginReactHooks,
        },
        settings: {
            react: { version: "detect" },
        },
    },

    // 1) Règles Next Core Web Vitals (via plugin) + monorepo rootDir
    ...compat.config({
        extends: ["plugin:@next/next/core-web-vitals"],
        settings: { next: { rootDir: ["apps/web/"] } },
    }),

    // 2) apps/web : TS type-aware + resolver TS + règles utiles
    {
        files: ["apps/web/{app,src}/**/*.{ts,tsx}"],
        // ❌ pas de "plugins" ici pour éviter "Cannot redefine plugin"
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: ["./apps/web/tsconfig.json"],
                tsconfigRootDir,
            },
        },
        settings: {
            "import/resolver": {
                typescript: {
                    project: [
                        "./apps/web/tsconfig.json",
                        "./packages/types/tsconfig.json",
                        "./packages/domain/tsconfig.json",
                        "./packages/services/tsconfig.json",
                        "./packages/ui/tsconfig.json",
                    ],
                },
            },
        },
        rules: {
            "react/jsx-no-undef": "error",
            "react/react-in-jsx-scope": "off",
            "import/no-unresolved": "error",
            "@typescript-eslint/no-redundant-type-constituents": "warn",
            "@typescript-eslint/no-unsafe-call": "warn",
            "@typescript-eslint/no-unsafe-member-access": "warn",
            "@typescript-eslint/no-unsafe-assignment": "warn",
            "@typescript-eslint/no-unsafe-return": "warn",
        },
    },

    // 3) packages/* : TS type-aware + resolver TS (pas de règles Next ici)
    {
        files: ["packages/**/*.{ts,tsx}"],
        // ❌ pas de "plugins" ici non plus
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
