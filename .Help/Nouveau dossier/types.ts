// scripts/generator/types.ts
export type Assoc =
    | { kind: "hasMany"; target: string; targetFk: string }
    | { kind: "belongsTo"; target: string; fk: string };

export type Field =
    | {
          name: string;
          kind: "string" | "number" | "boolean" | "enum" | "id";
          enumValues?: string[];
          required?: boolean;
      }
    | {
          name: string;
          kind: "custom";
          refType: string; // <-- mandatory now
          required?: boolean;
      }
    | { name: string; kind: "unknown"; required?: boolean };

export type ModelMeta = {
    name: string;
    type: "model" | "customType";
    fields: Field[];
    assocs: Assoc[];
    identifier?: string[]; // présent si composite identifier([...])
};

export type RelationDef =
    | { kind: "hasMany"; child: string; childFk: string }
    | { kind: "manyToMany"; through: string; parentKey: string; childKey: string; child: string };

export type RelationsMap = Record<string, Record<string, RelationDef>>;
