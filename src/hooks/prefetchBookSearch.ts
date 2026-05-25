import { searchBooksWithCovers } from "../api/openLibrary";
import { queryClient } from "../lib/queryClient";
import { bookSearchKeys } from "./useBookSearch";

export function prefetchBookSearch(query: string, page: number): void {
	const trimmed = query.trim();
	if (!trimmed || page < 1) {
		return;
	}

	void queryClient.prefetchQuery({
		queryKey: bookSearchKeys.list(trimmed, page),
		queryFn: () => searchBooksWithCovers(trimmed, page),
	});
}
