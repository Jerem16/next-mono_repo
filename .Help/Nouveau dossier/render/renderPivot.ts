// scripts/generator/render/renderPivot.ts
import path from "node:path";
import { OUT_RELATIONS, ensureDir, safeWrite, lower } from "../utils/fs";
import { ModelMeta, Assoc } from "../types";

export function renderPivot(m: ModelMeta) {
    const dir = path.join(OUT_RELATIONS, lower(m.name));
    ensureDir(dir);

    const belongs = m.assocs.filter((a) => a.kind === "belongsTo") as Extract<
        Assoc,
        { kind: "belongsTo" }
    >[];
    if (belongs.length !== 2) {
        console.warn("Pivot attendu 2 belongsTo:", m.name);
        return;
    }
    const a = belongs[0],
        b = belongs[1];

    const serviceTs = `import { relationService } from "@src/entities/services/relationService";
export const ${lower(m.name)}Service = relationService("${m.name}", "${a.fk}", "${b.fk}");
`;
    safeWrite(path.join(dir, "service.ts"), serviceTs);

    const typesTs = `export type ${m.name}Id = { ${a.fk}: string; ${b.fk}: string };`;
    safeWrite(path.join(dir, "types.ts"), typesTs);

    const indexTs = `export * from "./service";
export * from "./types";
`;
    safeWrite(path.join(dir, "index.ts"), indexTs);
}
