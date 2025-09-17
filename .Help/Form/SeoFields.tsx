// src/components/SeoFields.tsx
import React from "react";
import EditableField from "./EditableField";
import "./_SeoFields.scss";

type SeoFieldsProps = {
    seo: {
        title: string;
        description: string;
        image: string;
    };
    readOnly: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function SeoFields({ seo, readOnly, onChange }: SeoFieldsProps) {
    return (
        <fieldset className="seo-fields">
            <legend className="seo-fields_legend">SEO</legend>

            <EditableField
                name="seo.title"
                label="SEO Titre"
                value={seo.title}
                onChange={onChange}
                readOnly={readOnly}
            />
            <EditableField
                name="seo.description"
                label="SEO Description"
                value={seo.description}
                onChange={onChange}
                readOnly={readOnly}
            />
            <EditableField
                name="seo.image"
                label="Image SEO (URL)"
                value={seo.image}
                onChange={onChange}
                readOnly={readOnly}
            />
        </fieldset>
    );
}
