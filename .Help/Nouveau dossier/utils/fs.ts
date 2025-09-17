// scripts/generator/utils/fs.ts
import fs from "node:fs";
import path from "node:path";

export const ROOT = path.resolve(process.cwd());
export const RESOURCE = path.join(ROOT, "amplify", "data", "resource.ts");
export const OUT_INTROSPECTION = path.join(ROOT, "src", "entities", "introspection");
export const OUT_MODELS = path.join(ROOT, "src", "entities", "models");
export const OUT_RELATIONS = path.join(ROOT, "src", "entities", "relations");
export const OUT_CUSTOM_TYPES = path.join(ROOT, "src", "entities", "customTypes");

export function ensureDir(p: string) {
    if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

export function writeJSON(p: string, v: unknown) {
    ensureDir(path.dirname(p));
    fs.writeFileSync(p, JSON.stringify(v, null, 2) + "\n", "utf8");
}

export function safeWrite(p: string, content: string) {
    ensureDir(path.dirname(p));
    if (!fs.existsSync(p)) {
        fs.writeFileSync(p, content, "utf8");
        console.log("✔ created", path.relative(ROOT, p));
    } else {
        console.log("• exists ", path.relative(ROOT, p));
    }
}

export const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
export const pluralize = (s: string) => (s.endsWith("s") ? s : s + "s");
