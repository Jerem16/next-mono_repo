// eslint.config.mjs (ROOT)
import { fileURLToPath } from "node:url";
import path from "node:path";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

const tsconfigRootDir = path.dirname(fileURLToPath(new URL("./package.json", import.meta.url)));

const appRoots = ["apps/main", "apps/desktop", "apps/mobile"];
const appProjects = appRoots.map((dir) => `./${dir}/tsconfig.json`);
const packageProjects = [
    "./packages/types/tsconfig.json",
    "./packages/domain/tsconfig.json",
    "./packages/services/tsconfig.json",
    "./packages/ui/tsconfig.json",
];

const nextRules = nextPlugin.configs["core-web-vitals"].rules;

const restrictedSources = [...appRoots, "packages"];
const restrictedZones = [];
for (const from of restrictedSources) {
    for (const target of appRoots) {
        if (from === target) {
            continue;
        }

        restrictedZones.push({
            target: `./${target}`,
            from: `./${from}`,
        });
    }
}

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
            "@next/next": nextPlugin,
        },
        settings: {
            react: { version: "detect" },
        },
    },
    {
        files: ["apps/{main,desktop,mobile}/**/*.{ts,tsx,js,jsx}"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: [...appProjects, ...packageProjects],
                tsconfigRootDir,
            },
        },
        settings: {
            next: { rootDir: appRoots.map((dir) => `./${dir}`) },
            "import/resolver": {
                typescript: {
                    project: [...appProjects, ...packageProjects],
                },
            },
        },
        rules: {
            ...nextRules,
            "@next/next/no-html-link-for-pages": "off",
            "react/jsx-no-undef": "error",
            "react/react-in-jsx-scope": "off",
            "import/no-unresolved": "error",
            "import/no-restricted-paths": ["error", { zones: restrictedZones }],
            "@typescript-eslint/no-explicit-any": "error",
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
            "import/no-restricted-paths": ["error", { zones: restrictedZones }],
            "@typescript-eslint/no-explicit-any": "error",
        },
    },
];
