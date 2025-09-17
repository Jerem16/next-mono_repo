// src/components/shared/EntityForm.tsx
"use client";
import React, { type FormEvent } from "react";
import { SaveButton, AddButton, CancelButton } from "@components/buttons";
import { type FieldKey } from "@entities/core/hooks";
// import "./_EntityForm.scss";

type Props<T extends Record<string, unknown>> = {
    formData: Partial<T>;
    fields: FieldKey<T>[];
    labels: (field: FieldKey<T>) => string;
    handleChange: (field: FieldKey<T>, value: unknown) => void;
    handleSubmit: () => void;
    isEdit: boolean;
    onCancel: () => void;
    requiredFields: FieldKey<T>[];
};

export default function EntityForm<T extends Record<string, unknown>>({
    formData,
    fields,
    labels,
    handleChange,
    handleSubmit,
    isEdit,
    onCancel,
    requiredFields,
}: Props<T>) {
    return (
        <form
            onSubmit={(e: FormEvent) => {
                e.preventDefault();
                handleSubmit();
            }}
            className="entity-form"
        >
            {fields.map((field) => (
                <div key={String(field)} className="entity-form_field">
                    <label htmlFor={String(field)}>{labels(field)}</label>
                    <input
                        id={String(field)}
                        name={String(field)}
                        placeholder={labels(field)}
                        value={String(formData[field] ?? "")}
                        onChange={(e) => handleChange(field, e.target.value)}
                        required={requiredFields.includes(field)}
                    />
                </div>
            ))}

            <div className="entity-form_actions">
                {isEdit ? (
                    <>
                        <SaveButton
                            onClick={handleSubmit}
                            label="Enregistrer"
                            className="min-w-[120px]"
                        />
                        <CancelButton
                            onClick={onCancel}
                            label="Annuler"
                            className="min-w-[120px]"
                        />
                    </>
                ) : (
                    <AddButton onClick={handleSubmit} label="Créer" className="min-w-[120px]" />
                )}
            </div>
        </form>
    );
}
