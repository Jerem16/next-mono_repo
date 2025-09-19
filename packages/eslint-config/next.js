// packages/eslint-config/next.js
import { fileURLToPath } from "node:url";
import path from "node:path";
import nextPlugin from "@next/eslint-plugin-next";
import { config as reactConfig } from "./react-internal.js";

const tsconfigRootDir = path.dirname(fileURLToPath(new URL("../../package.json", import.meta.url)));
const nextRules = nextPlugin.configs["core-web-vitals"].rules;

export default function makeNextConfig({
    projects = ["./apps/main/tsconfig.json"],
    include = ["apps/main/{app,src}/**/*.{ts,tsx}"],
    rootDir = ["apps/main"],
} = {}) {
    return [
        ...reactConfig,
        {
            files: include,
            plugins: { "@next/next": nextPlugin },
            languageOptions: {
                parserOptions: {
                    project: projects,
                    tsconfigRootDir,
                },
            },
            settings: { next: { rootDir } },
            rules: {
                ...nextRules,
                "@next/next/no-html-link-for-pages": "off",
                "@typescript-eslint/no-explicit-any": "error",
                "@typescript-eslint/no-unsafe-call": "off",
                "@typescript-eslint/no-unsafe-member-access": "off",
                "@typescript-eslint/no-unsafe-return": "off",
                "@typescript-eslint/no-unsafe-assignment": "off",
            },
        },
    ];
}
