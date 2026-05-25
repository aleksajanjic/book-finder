import { useQuery } from "@tanstack/react-query";
import { fetchBookDetails } from "./fetchBookDetails";

export const bookDetailsKeys = {
	all: ["book"] as const,
	detail: (id: string) => [...bookDetailsKeys.all, id] as const,
};

export type { BookDetailsData } from "./fetchBookDetails";

export function useBookDetails(id: string | undefined) {
	return useQuery({
		queryKey: bookDetailsKeys.detail(id ?? ""),
		queryFn: () => fetchBookDetails(id!),
		enabled: Boolean(id),
	});
}
