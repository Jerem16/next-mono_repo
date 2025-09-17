// scripts/generator/render/renderModelForm.ts
import path from "node:path";
import { outDir, isCustomField, kebab, singular, safeWrite } from "./common";
import type { ModelMeta, RelationsMap } from "../types";
import type { GEN as GEN_TYPE } from "../generator.config";

export function renderModelForm(m: ModelMeta, relations: RelationsMap, GEN: typeof GEN_TYPE) {
    const dir = outDir(GEN, m.name);

    const simple = m.fields.filter((f) =>
        ["string", "number", "boolean", "id", "enum"].includes(f.kind)
    );
    const custom = m.fields.filter(isCustomField);
    const rel = relations[m.name] ?? {};
    const manyToMany = Object.values(rel).filter((d: any) => d.kind === "manyToMany") as any[];
    const relKeysSingular = manyToMany.map((d) =>
        singular(d.child[0].toLowerCase() + d.child.slice(1))
    );

    const ctImports = custom
        .map(
            (cf) =>
                `import { initial${cf.refType}Form, to${cf.refType}Form } from "${GEN.paths.customTypeFormDir(cf.refType)}";`
        )
        .join("\n");

    const initLines: string[] = [];
    if (GEN.rules.includeIdInForm) initLines.push(`  id: "",`);
    for (const f of simple) {
        if (f.name === "id" && GEN.rules.includeIdInForm) continue; // déjà ajouté
        if (f.kind === "string" || f.kind === "id" || f.kind === "enum")
            initLines.push(`  ${f.name}: "",`);
        else if (f.kind === "number") initLines.push(`  ${f.name}: 0,`);
        else if (f.kind === "boolean") initLines.push(`  ${f.name}: false,`);
    }
    for (const cf of custom) initLines.push(`  ${cf.name}: { ...initial${cf.refType}Form },`);
    for (const k of relKeysSingular) initLines.push(`  ${k}Ids: [] as string[],`);

    const toFormLines: string[] = [];
    if (GEN.rules.includeIdInForm) toFormLines.push(`  id: model.id ?? "",`);
    for (const f of simple) {
        if (f.name === "id") continue;
        if (f.kind === "string" || f.kind === "id" || f.kind === "enum")
            toFormLines.push(`  ${f.name}: model.${f.name} ?? "",`);
        else if (f.kind === "number") toFormLines.push(`  ${f.name}: model.${f.name} ?? 0,`);
        else if (f.kind === "boolean") toFormLines.push(`  ${f.name}: model.${f.name} ?? false,`);
    }
    for (const cf of custom)
        toFormLines.push(`  ${cf.name}: to${cf.refType}Form(model.${cf.name}),`);
    for (const k of relKeysSingular) toFormLines.push(`  ${k}Ids,`);

    const argsTupleType = manyToMany.length
        ? `[${manyToMany.map(() => "string[]").join(", ")}]`
        : "[]";
    const argsDecl = manyToMany.length
        ? ", " + relKeysSingular.map((k) => `${k}Ids: string[] = []`).join(", ")
        : "";
    const argsCall = manyToMany.length
        ? ", " + relKeysSingular.map((k) => `${k}Ids`).join(", ")
        : "";

    const content = `// AUTO-GENERATED – DO NOT EDIT
import type { ${m.name}Type, ${m.name}FormType } from "./types";
import { type ModelForm, createModelForm } from "${GEN.paths.createModelForm}";
${ctImports ? "\n" + ctImports : ""}

export const initial${m.name}Form: ${m.name}FormType = {
${initLines.join("\n")}
};

function to${m.name}Form(model: ${m.name}Type${argsDecl ? argsDecl.replace(/: /g, " = ") : ""}): ${m.name}FormType {
  return {
${toFormLines.join("\n")}
  };
}

export const ${m.name[0].toLowerCase() + m.name.slice(1)}Form = createModelForm<${m.name}Type, ${m.name}FormType, ${argsTupleType}>(
  initial${m.name}Form,
  (model${argsDecl}) => to${m.name}Form(model${argsCall})
);

export { to${m.name}Form };
`;
    safeWrite(path.join(dir, "form.ts"), content);
}
