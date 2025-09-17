import React from "react";
import { EditButton, DeleteButton } from "@components/buttons";
import { type FieldKey } from "@entities/core/hooks";

export type ReadOnlyViewProps<T> = {
    titleHeading?: string;
    fields: FieldKey<T>[];
    data: T;
    labels: (field: FieldKey<T>) => string;
    renderIcon?: (field: FieldKey<T>) => React.ReactNode;
    renderValue?: (field: FieldKey<T>, value: string) => React.ReactNode;
    extraButtons?: (field: FieldKey<T>, value: string) => React.ReactNode;
    onEditField: (p: { field: FieldKey<T>; value: string }) => void;
    onClearField: (field: FieldKey<T>) => void;
};

export default function ReadOnlyView<T extends Record<string, unknown>>({
    data,
    fields,
    labels,
    onEditField,
    onClearField,
    titleHeading,
    renderIcon,
    extraButtons,
    renderValue,
}: ReadOnlyViewProps<T>) {
    return (
        <div className="read-only-view">
            <h2 className="read-only-view_title">{titleHeading}</h2>
            <div className="read-only-view_list">
                {fields.map((field) => {
                    const raw = data[field];
                    const value = raw === undefined || raw === null ? "" : String(raw);
                    return (
                        <div key={String(field)} className="read-only-view_item">
                            <div className="read-only-view_item-header">
                                <div className="read-only-view_label">
                                    {renderIcon?.(field)} <span>{labels(field)}</span>
                                </div>
                                <div className="read-only-view_actions">
                                    {extraButtons?.(field, value)}
                                    <EditButton
                                        onEdit={() => onEditField({ field, value })}
                                        className="!w-8 !h-8"
                                        // size="medium"
                                        variantType="icon"
                                    />
                                    {onClearField && value && (
                                        <DeleteButton
                                            onDelete={() => onClearField(field)}
                                            className="!w-8 !h-8"
                                            size="small"
                                            // size="medium"
                                            variantType="icon"
                                        />
                                    )}
                                </div>
                            </div>
                            <div>
                                {renderValue ? (
                                    renderValue(field, value)
                                ) : value ? (
                                    <p className="read-only-view_value">{value}</p>
                                ) : (
                                    <p className="read-only-view_value read-only-view_value--empty">
                                        Information non disponible
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
