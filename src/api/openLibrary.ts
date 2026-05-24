import { API } from "../constants/api";
import { assertOkResponse } from "../lib/httpError";
import { withRequestToast } from "../lib/requestToast";
import type { BookDetail, BookSearchResult } from "../types/books";

export const BOOKS_PER_PAGE = 8;
const SEARCH_FIELDS = "key,title,author_name,cover_i,first_publish_year, isnb";

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

async function fetchSearchResults(
	query: string,
	page: number,
): Promise<SearchBooksWithCoversResult> {
	const offset = (page - 1) * BOOKS_PER_PAGE;
	const params = new URLSearchParams({
		q: buildCoverSearchQuery(query),
		offset: String(offset),
		limit: String(BOOKS_PER_PAGE),
		facet: "false",
	});

	const res = await fetch(`${API.BASE}/search.json?${params}`);
	await assertOkResponse(res, "search");
	const data = await res.json();

	return {
		docs: data.docs ?? [],
		numFound: data.numFound ?? 0,
	};
}

export function searchBooksWithCovers(
	query: string,
	page = 1,
): Promise<SearchBooksWithCoversResult> {
	return withRequestToast("Search failed", () =>
		fetchSearchResults(query, page),
	);
}

async function fetchBook(id: string): Promise<BookDetail> {
	const res = await fetch(`${API.BASE}/works/${id}.json`);
	await assertOkResponse(res, "book");
	return res.json();
}

export function getBook(id: string): Promise<BookDetail> {
	return withRequestToast("Could not load book", () => fetchBook(id));
}

export async function getAuthor(id: string): Promise<{ name: string }> {
	const res = await fetch(`${API.BASE}/authors/${id}.json`);
	await assertOkResponse(res, "author");
	return res.json();
}

export const getCoverUrl = (
	coverId?: number,
	size: "S" | "M" | "L" = "L",
): string | undefined => {
	if (!coverId) return undefined;
	return `${API.COVERS}/${coverId}-${size}.jpg`;
};

export async function searchBook() {
	const offset = (1 - 1) * BOOKS_PER_PAGE;

	const params = new URLSearchParams({
		q: buildCoverSearchQuery("batman"),
	});

	const res = await fetch(`${API.BASE}/search.json?${params.toString()}`);

	if (!res.ok) {
		throw new Error("Failed to fetch books");
	}

	return res.json();
}
