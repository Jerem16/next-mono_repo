// scripts/generator/render/renderModelTypes.ts
import path from "node:path";
import { outDir, isCustomField, kebab, singular, safeWrite } from "./common";
import type { ModelMeta, RelationsMap } from "../types";
import type { GEN as GEN_TYPE } from "../generator.config";

export function renderModelTypes(m: ModelMeta, relations: RelationsMap, GEN: typeof GEN_TYPE) {
    const dir = outDir(GEN, m.name);

    const rel = relations[m.name] ?? {};
    const manyToMany = Object.values(rel).filter((d: any) => d.kind === "manyToMany") as any[];
    const relKeysSingular = manyToMany.map((d) =>
        singular(d.child[0].toLowerCase() + d.child.slice(1))
    );
    const relUnion = relKeysSingular.length
        ? relKeysSingular.map((k) => `"${k}"`).join(" | ")
        : "never";

    const custom = m.fields.filter(isCustomField);
    const ctUnion = custom.length ? custom.map((cf) => `"${cf.refType}"`).join(" | ") : "never";
    const ctImports = custom
        .map(
            (cf) =>
                `import type { ${cf.refType}Form } from "${GEN.paths.customTypeFormDir(cf.refType)}";`
        )
        .join("\n");
    const ctMap = custom.length
        ? `type CTMap = { ${custom.map((cf) => `${cf.refType}: ${cf.refType}Form`).join("; ")} };`
        : `type CTMap = Record<string, never>;`;

    const content = `// AUTO-GENERATED – DO NOT EDIT
import type { BaseModel, CreateOmit, UpdateInput, ModelForm } from "${GEN.paths.myTypes}";
${ctImports ? "\n" + ctImports : ""}

export type ${m.name}Type = BaseModel<"${m.name}">;
export type ${m.name}TypeOmit = CreateOmit<"${m.name}">;
export type ${m.name}TypeUpdateInput = UpdateInput<"${m.name}">;

${ctMap}
type RelKeys = ${relUnion};

export type ${m.name}FormType = ModelForm<
  "${m.name}",
  never,
  RelKeys,
  CTMap,
  ${ctUnion}
>;
`;
    safeWrite(path.join(dir, "types.ts"), content);
}
