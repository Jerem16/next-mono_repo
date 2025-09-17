// scripts/generator/render/common.ts
import path from "node:path";
import { ensureDir, safeWrite } from "../utils/fs";
import type { Field } from "../types";
import type { GEN as GEN_TYPE } from "../generator.config";

export function outDir(gen: typeof GEN_TYPE, modelName: string) {
    const dir = path.join(
        process.cwd(),
        gen.out.models,
        modelName.charAt(0).toLowerCase() + modelName.slice(1)
    );
    ensureDir(dir);
    return dir;
}
export const isCustomField = (f: Field): f is Extract<Field, { kind: "custom"; refType: string }> =>
    f.kind === "custom";
export const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
export const singular = (s: string) => (s.endsWith("s") ? s.slice(0, -1) : s);
export { safeWrite };
