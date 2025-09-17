import React, { ChangeEvent, FocusEvent } from "react";

type EditableFieldProps = {
    label: string;
    value?: string;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    readOnly: boolean;
    name: string;
    onFocus?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const EditableField = ({
    label,
    value = "",
    onChange,
    readOnly,
    name,
    onFocus,
    onBlur,
}: EditableFieldProps) => (
    <div className="editable-field">
        <label className="editable-field_label" htmlFor={name}>
            {label}
        </label>
        <input
            type="text"
            id={name}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            readOnly={readOnly}
            className="editable-field_input"
        />
    </div>
);

export default EditableField;
