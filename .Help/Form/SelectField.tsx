// src/components/SelectField.tsx
import React from "react";
import "./_SelectField.scss";

interface Option {
    value: string;
    label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    name: string;
    value: string;
    options: Option[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    hideLabel?: boolean; // optionnel : cacher visuellement le label (accessibilité conservée)
}

export default function SelectField({
    label,
    name,
    value,
    options,
    onChange,
    required = false,
    hideLabel = false,
    ...rest
}: SelectFieldProps) {
    const id = `select-${name}`;

    return (
        <div className="select-field">
            <label
                htmlFor={id}
                className={hideLabel ? "sr-only select-field_label" : "select-field_label"}
            >
                {label}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="select-field_input"
                {...rest}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
