interface ItemSelectorProps<
    T extends Record<K, string> & { order?: number | null },
    K extends keyof T,
> {
    items: T[];
    idKey: K;
    selectedIds: T[K][];
    onChange: (ids: T[K][]) => void;
    label: string;
    getLabel: (item: T) => string;
}

export default function ItemSelector<
    T extends Record<K, string> & { order?: number | null },
    K extends keyof T,
>({ items, idKey, selectedIds, onChange, label, getLabel }: ItemSelectorProps<T, K>) {
    const toggle = (id: T[K]) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((x) => x !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    // On trie par order si présent, sinon on garde l'ordre initial
    const sortedItems = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return (
        <div className="item-selector">
            <label className="item-selector__label">{label}</label>
            <div className="item-selector__list">
                {sortedItems.map((item, idx) => {
                    const id = item[idKey];
                    const checked = selectedIds.includes(id);
                    return (
                        <div
                            key={id || `item-${idx}`}
                            className={`item-selector__item${
                                checked ? " item-selector__item--checked" : ""
                            }`}
                            onClick={() => toggle(id)}
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggle(id)}
                                className="item-selector__input"
                            />
                            <div>
                                <span className="item-selector__item-label">{getLabel(item)}</span>{" "}
                                <span className="item-selector__item-id">(ID: {id})</span>
                                {"order" in item && typeof item.order === "number" ? (
                                    <span className="item-selector__item-order">
                                        ordre : {item.order}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
