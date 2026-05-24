import { API } from "../constants/api";
import { rateLimitedFetch } from "../lib/rateLimitedFetch";
import type { BookDetail, BookSearchResult } from "../types/books";

export const BOOKS_PER_PAGE = 8;

const SEARCH_FIELDS = "key,title,author_name,cover_i,first_publish_year";

export interface SearchBooksWithCoversResult {
	docs: BookSearchResult[];
	numFound: number;
}

function buildCoverSearchQuery(title: string): string {
	const trimmed = title.trim();
	const titleClause = trimmed.includes(" ")
		? `title:"${trimmed.replace(/"/g, '\\"')}"`
		: `title:${trimmed}`;

	return `${titleClause} AND cover_i:[1 TO *]`;
}

export async function searchBooksWithCovers(
	query: string,
	page = 1,
): Promise<SearchBooksWithCoversResult> {
	const offset = (page - 1) * BOOKS_PER_PAGE;
	const params = new URLSearchParams({
		q: buildCoverSearchQuery(query),
		offset: String(offset),
		limit: String(BOOKS_PER_PAGE),
		facet: "false",
		fields: SEARCH_FIELDS,
	});

	const res = await rateLimitedFetch(`${API.BASE}/search.json?${params}`);

	if (!res.ok) {
		throw new Error("Search failed");
	}

	const data = await res.json();

	return {
		docs: data.docs ?? [],
		numFound: data.numFound ?? 0,
	};
}

export async function getBook(id: string): Promise<BookDetail> {
	const res = await rateLimitedFetch(`${API.BASE}/works/${id}.json`);

	if (!res.ok) throw new Error("Book fetch failed");

	return res.json();
}

export async function getAuthor(id: string): Promise<{ name: string }> {
	const res = await rateLimitedFetch(`${API.BASE}/authors/${id}.json`);

	if (!res.ok) throw new Error("Author fetch failed");

	return res.json();
}

export const getCoverUrl = (
	coverId?: number,
	size: "S" | "M" | "L" = "L",
): string | undefined => {
	if (!coverId) return undefined;
	return `${API.COVERS}/${coverId}-${size}.jpg`;
};
