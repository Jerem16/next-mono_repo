// scripts/generator/render/renderModelConfig.ts
import path from "node:path";
import { outDir, isCustomField, singular, safeWrite } from "./common";
import type { ModelMeta, RelationsMap, Field } from "../types";
import type { GEN as GEN_TYPE } from "../generator.config";

function zod(f: Field): string {
    switch (f.kind) {
        case "string":
            return f.required ? "z.string().min(1)" : "z.string().optional()";
        case "number":
            return f.required ? "z.number()" : "z.number().optional()";
        case "boolean":
            return f.required ? "z.boolean()" : "z.boolean().optional()";
        case "enum":
            return f.required
                ? `z.enum([${(f.enumValues ?? []).map((v) => `"${v}"`).join(", ")}])`
                : `z.enum([${(f.enumValues ?? []).map((v) => `"${v}"`).join(", ")}]).optional()`;
        case "id":
            return f.required ? "z.string().min(1)" : "z.string().optional()";
        case "custom":
            return f.required ? "z.any()" : "z.any().optional()";
        default:
            return "z.any().optional()";
    }
}

export function renderModelConfig(m: ModelMeta, relations: RelationsMap, GEN: typeof GEN_TYPE) {
    const dir = outDir(GEN, m.name);

    const rel = relations[m.name] ?? {};
    const manyToMany = Object.values(rel).filter((d: any) => d.kind === "manyToMany") as any[];
    const relKeysSingular = manyToMany.map((d) =>
        singular(d.child[0].toLowerCase() + d.child.slice(1))
    );

    // hasMany overrides (virtuel *Ids* pour UI)
    const hasManyUI = GEN.rules.exposeHasManyIds[m.name] ?? [];
    for (const k of hasManyUI) if (!relKeysSingular.includes(k)) relKeysSingular.push(k);

    const simple = m.fields.filter((f) =>
        ["string", "number", "boolean", "id", "enum"].includes(f.kind)
    );
    const custom = m.fields.filter(isCustomField);

    // Editable: sans id/owner/createdAt/updatedAt (et FK si tu veux les gérer ailleurs)
    const omit = new Set(["id", "owner", "createdAt", "updatedAt"]);
    const editableSimple = simple.filter((f) => !omit.has(f.name));

    const zodLines = [
        ...editableSimple.map((f) => `  ${f.name}: ${z(f)},`),
        ...custom.map((cf) => `  ${cf.name}: z.any().optional(),`),
        ...relKeysSingular.map((k) => `  ${k}Ids: z.array(z.string()),`),
    ];

    const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const labelsLines = [
        ...editableSimple.map((f) => `    case "${f.name}": return "${label(f.name)}";`),
        ...custom.map((cf) => `    case "${cf.name}": return "${label(cf.name)}";`),
        ...relKeysSingular.map((k) => `    case "${k}Ids": return "${label(k)}";`),
    ];

    // toInput sans any
    const pickKeys = editableSimple.map((f) => `"${f.name}"`).join(" | ") || "never";
    const mapLines = editableSimple.map((f) => `    ${f.name}: f.${f.name},`).join("\n");
    const fieldsArr = [
        ...editableSimple.map((f) => `"${f.name}"`),
        ...custom.map((cf) => `"${cf.name}"`),
        ...relKeysSingular.map((k) => `"${k}Ids"`),
    ].join(",\n    ");

    const content = `// AUTO-GENERATED – DO NOT EDIT
import type { ${m.name}Type } from "./types";
import { z } from "zod";

export type ${m.name}EditableKeys =
${[...editableSimple.map((f) => `  | "${f.name}"`), ...custom.map((cf) => `  | "${cf.name}"`), ...relKeysSingular.map((k) => `  | "${k}Ids"`)].join("\n") || "  never"};

export const ${m.name[0].toLowerCase() + m.name.slice(1)}Config = {
  model: "${m.name}" as const,

  fields: [
    ${fieldsArr}
  ] as ${m.name}EditableKeys[],

  labels(field: ${m.name}EditableKeys): string {
    switch (field) {
${labelsLines.join("\n")}
      default: return field;
    }
  },

  zodSchema: z.object({
${zodLines.join("\n")}
  }),

  toInput(form: Partial<Record<${m.name}EditableKeys, unknown>>) {
    const f = form as Partial<Pick<${m.name}Type, ${pickKeys}>>;
    const input = {
${mapLines}
    } satisfies Partial<${m.name}Type>;
    return input;
  },

  relations: {
    manyToManyKeys: [${manyToMany.map((d: any) => `"${singular(d.child[0].toLowerCase() + d.child.slice(1))}"`).join(", ")}] as const
  }
} as const;
`;
    safeWrite(path.join(dir, "config.ts"), content);
}
