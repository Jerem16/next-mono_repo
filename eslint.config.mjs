import { fileURLToPath } from "node:url";
import path from "node:path";
import { FlatCompat } from "@eslint/eslintrc";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

const tsconfigRootDir = path.dirname(fileURLToPath(new URL("./package.json", import.meta.url)));
const compat = new FlatCompat({ baseDirectory: tsconfigRootDir });

const appProjects = ["./apps/desktop/tsconfig.json", "./apps/mobile/tsconfig.json"];
const packageProjects = [
    "./packages/domain/tsconfig.json",
    "./packages/services/tsconfig.json",
    "./packages/types/tsconfig.json",
    "./packages/ui/tsconfig.json",
];

export default [
    {
        ignores: [
            "**/dist/**",
            "**/.next/**",
            "**/node_modules/**",
            "apps/*/next-env.d.ts",
            "apps/*/next.config.ts",
        ],
    },
    {
        plugins: {
            import: importPlugin,
            react: pluginReact,
            "react-hooks": pluginReactHooks,
            "@typescript-eslint": tseslint.plugin,
        },
        settings: {
            react: { version: "detect" },
        },
    },
    ...compat.config({
        extends: ["plugin:@next/next/core-web-vitals"],
        settings: { next: { rootDir: ["apps/desktop", "apps/mobile"] } },
    }),
    {
        files: ["apps/{desktop,mobile}/{app,src}/**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: appProjects,
                tsconfigRootDir,
            },
        },
        settings: {
            "import/resolver": {
                typescript: {
                    project: [...appProjects, ...packageProjects],
                },
            },
        },
        rules: {
            "react/jsx-no-undef": "error",
            "react/react-in-jsx-scope": "off",
            "import/no-unresolved": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-redundant-type-constituents": "warn",
            "@typescript-eslint/no-unsafe-call": "warn",
            "@typescript-eslint/no-unsafe-member-access": "warn",
            "@typescript-eslint/no-unsafe-assignment": "warn",
            "@typescript-eslint/no-unsafe-return": "warn",
        },
    },
    {
        files: ["packages/**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: packageProjects,
                tsconfigRootDir,
            },
        },
        settings: {
            "import/resolver": {
                typescript: {
                    project: packageProjects,
                },
            },
        },
        rules: {
            "import/no-unresolved": "error",
            "@typescript-eslint/no-explicit-any": "error",
        },
    },
];
