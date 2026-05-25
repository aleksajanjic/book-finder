import { queryClient } from "../lib/queryClient";
import { fetchBookDetails } from "./fetchBookDetails";
import { bookDetailsKeys } from "./useBookDetails";

export function prefetchBookDetails(id: string | undefined): void {
	if (!id) {
		return;
	}

	void queryClient.prefetchQuery({
		queryKey: bookDetailsKeys.detail(id),
		queryFn: () => fetchBookDetails(id),
	});
}
