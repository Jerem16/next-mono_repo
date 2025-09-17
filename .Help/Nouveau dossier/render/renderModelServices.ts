// services
import path from "node:path";
import { outDir, safeWrite } from "./common";
import type { ModelMeta } from "../types";
import type { GEN as GEN_TYPE } from "../generator.config";

export function renderModelServices(m: ModelMeta, GEN: typeof GEN_TYPE) {
    const dir = outDir(GEN, m.name);
    const low = m.name[0].toLowerCase() + m.name.slice(1);
    const content = `// AUTO-GENERATED – DO NOT EDIT
import { crudService } from "${GEN.paths.crudService}";
export const ${low}Service = crudService("${m.name}");
`;
    safeWrite(path.join(dir, "service.ts"), content);
}
