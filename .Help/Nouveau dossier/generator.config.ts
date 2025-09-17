// scripts/generator/generator.config.ts
export const GEN = {
    // Fichiers Amplify
    schemaRel: "amplify/data/resource.ts",
    tsconfigRel: "tsconfig.json",

    // Dossiers de sortie
    out: {
        models: "src/entities/models",
        customTypes: "src/entities/customTypes",
        introspection: "src/entities/introspection",
    },

    // Aliases d'import (ta “source de vérité”)
    paths: {
        myTypes: "@myTypes/amplifyBaseTypes",
        createModelForm: "@src/entities/core/createModelForm", // ou "@entities/core/createModelForm"
        crudService: "@src/services", // tu l’utilises déjà ainsi
        customTypeFormDir: (refType: string) =>
            `@src/entities/customTypes/${refType.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}/form`,
    },

    // Règles de génération (pure UX)
    rules: {
        // inclure id dans les forms (lecture seule) – tu le fais déjà, on garde true
        includeIdInForm: true,

        // Dans toInput(): exclure toujours id/owner/createdAt/updatedAt
        omitSystemFields: true,

        // Générer *Ids SEULEMENT pour N↔N (pivots). Pour forcer des hasMany -> *Ids :
        // ex: { Author: ["post"] }  => postIds dans AuthorForm
        exposeHasManyIds: {} as Record<string, string[]>,
    },
} as const;
