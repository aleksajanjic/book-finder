import { API } from "../constants/api";
import type { BookDetail, BookSearchResult } from "../types/books";

export async function searchBooks(query: string, page = 1) {
	const res = await fetch(
		`${API.BASE}/search.json?title=${encodeURIComponent(query)}&page=${page}`,
	);

	if (!res.ok) throw new Error("Search failed");

	const data = await res.json();

	return {
		docs: data.docs.filter((b: BookSearchResult) => b.cover_i),
		numFound: data.numFound,
	};
}

export async function getBook(id: string): Promise<BookDetail> {
	const res = await fetch(`${API.BASE}/works/${id}.json`);

	if (!res.ok) throw new Error("Book fetch failed");

	return res.json();
}

export function getCoverUrl(
	coverId: number | undefined,
	size: "S" | "M" | "L" = "L",
): string | null {
	if (!coverId) return null;
	return `${API.COVERS}/${coverId}-${size}.jpg`;
}
