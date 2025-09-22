import type { Result } from "@src/utils/context/SearchContext";

export const normalizeWord = (word: string) =>
  word
    .toLowerCase()
    .replace(/[.,;!?]/g, "")
    .trim();

export const filterSuggestions = (
  items: Result[],
  query: string,
): string[] => {
  const normalizedQuery = normalizeWord(query);
  return Array.from(
    new Set(
      items
        .map((item) =>
          item.text
            .split(/\s+/)
            .map(normalizeWord)
            .find((word) => word.startsWith(normalizedQuery)),
        )
        .filter((word): word is string => Boolean(word)), // Filtrer les valeurs `undefined`
    ),
  );
};
