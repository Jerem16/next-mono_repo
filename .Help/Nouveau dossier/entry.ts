// scripts/generator/entry.ts
import path from "node:path";
import { GEN } from "./generator.config";
import { parseSchema } from "./parse/parseSchema";
import { inferRelations } from "./parse/inferRelations";
import { ensureDir, writeJSON } from "./utils/fs";
import { renderModel } from "./render/renderModel";
import { renderPivot } from "./render/renderPivot";
import { renderCustomType } from "./render/renderCustomType";

async function main() {
    const ROOT = process.cwd();
    const metas = parseSchema({
        root: ROOT,
        resourceRel: GEN.schemaRel,
        tsconfigRel: GEN.tsconfigRel,
        debug: false,
    });

    // Inject id implicite (sauf composites)
    for (const m of metas) {
        if (m.type !== "model") continue;
        const hasComposite =
            Array.isArray((m as any).identifier) && (m as any).identifier.length > 0;
        const hasId = m.fields.some((f) => f.name === "id" && f.kind === "id");
        if (!hasComposite && !hasId) m.fields.unshift({ name: "id", kind: "id", required: true });
    }

    const { relations, pivots } = inferRelations(metas);

    await ensureDir(path.join(ROOT, GEN.out.introspection));
    await ensureDir(path.join(ROOT, GEN.out.models));
    await ensureDir(path.join(ROOT, GEN.out.customTypes));

    await writeJSON(path.join(ROOT, GEN.out.introspection, "models.manifest.json"), metas);
    await writeJSON(path.join(ROOT, GEN.out.introspection, "relations.manifest.json"), relations);

    // customTypes d'abord
    for (const ct of metas.filter((m) => m.type === "customType")) renderCustomType(ct, GEN);

    // pivots (services)
    for (const m of metas.filter((m) => m.type === "model" && pivots.includes(m.name)))
        renderPivot(m, GEN);

    // modèles (types/config/form/service/hooks/index)
    for (const m of metas.filter((m) => m.type === "model" && !pivots.includes(m.name)))
        renderModel(m, relations, GEN);

    console.log("✅ Generation done.");
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
