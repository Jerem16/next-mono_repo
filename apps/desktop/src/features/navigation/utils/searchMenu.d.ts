import type { MenuLinks } from "@src/features/navigation/types/menu";
import type { Result } from "@src/utils/context/SearchContext";

declare function searchQuery(jsonData: MenuLinks, query: string): Result[];

export default searchQuery;
