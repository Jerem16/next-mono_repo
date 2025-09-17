// orchestrateur
import { renderModelTypes } from "./renderModelTypes";
import { renderModelConfig } from "./renderModelConfig";
import { renderModelForm } from "./renderModelForm";
import { renderModelServices } from "./renderModelServices";
import { renderModelHooks } from "./renderModelHooks";
import type { ModelMeta, RelationsMap } from "../types";
import type { GEN as GEN_TYPE } from "../generator.config";

export function renderModel(m: ModelMeta, relations: RelationsMap, GEN: typeof GEN_TYPE) {
    renderModelTypes(m, relations, GEN);
    renderModelConfig(m, relations, GEN);
    renderModelForm(m, relations, GEN);
    renderModelServices(m, GEN);
    renderModelHooks(m, GEN);
}
