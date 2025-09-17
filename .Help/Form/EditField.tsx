import { SaveButton, BackButton } from "@components/buttons";
import React from "react";
import type { FieldKey } from "@entities/core/hooks";

export type EditFieldProps<T extends Record<string, unknown>> = {
    editModeField: { field: FieldKey<T>; value: string };
    setEditModeField: React.Dispatch<
        React.SetStateAction<{ field: FieldKey<T>; value: string } | null>
    >;
    saveSingleField: () => void;
    labels: (field: FieldKey<T>) => string;
};

export default function EditField<T extends Record<string, unknown>>({
    editModeField,
    setEditModeField,
    saveSingleField,
    labels,
}: EditFieldProps<T>) {
    const { field, value } = editModeField;

    return (
        <fieldset className="edit-field">
            <legend className="edit-field_legend">
                Modifier mon {labels(field).toLowerCase()} :
            </legend>

            <label htmlFor="edit-field" className="visually-hidden">
                {labels(field)}
            </label>
            <input
                id="edit-field"
                className="edit-field_input"
                value={value}
                placeholder={labels(field)}
                title={labels(field)}
                onChange={(e) =>
                    setEditModeField((prev) => (prev ? { ...prev, value: e.target.value } : null))
                }
            />

            <div className="edit-field_actions">
                <SaveButton onClick={saveSingleField} label="Sauvegarder" className="flex-1" />
                <BackButton
                    onClick={() => setEditModeField(null)}
                    label="Retour"
                    className="flex-1"
                />
            </div>
        </fieldset>
    );
}
