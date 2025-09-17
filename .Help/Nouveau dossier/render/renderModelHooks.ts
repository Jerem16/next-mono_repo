// hooks
import path from "node:path";
import { outDir, safeWrite } from "./common";
import type { ModelMeta } from "../types";
import type { GEN as GEN_TYPE } from "../generator.config";

export function renderModelHooks(m: ModelMeta, GEN: typeof GEN_TYPE) {
    const dir = outDir(GEN, m.name);
    const low = m.name[0].toLowerCase() + m.name.slice(1);
    const content = `// AUTO-GENERATED – DO NOT EDIT
import { createEntityHooks } from "@src/entities/core/createEntityHooks";
import { ${low}Config } from "./config";

export const { useManager: use${m.name}Manager, service: ${low}Service2, form: ${low}Form2 } =
  createEntityHooks(${low}Config);
`;
    safeWrite(path.join(dir, "hooks.ts"), content);
}
