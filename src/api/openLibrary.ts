const BASE = "https://openlibrary.org";
const COVERS = "https://covers.openlibrary.org/b/id";

export const searchBooks = async (
	title: string,
): Promise<BookSearchResult[]> => {
	const res = await fetch(
		`${BASE}/search.json?title=${encodeURIComponent(title)}`,
	);
	const data = await res.json();
	// Only return books that have a cover
	return data.docs.filter((b: BookSearchResult) => b.cover_i);
};

export const getBook = async (id: string): Promise<BookDetail> => {
	const res = await fetch(`${BASE}/works/${id}.json`);
	return res.json();
};

export const getCoverUrl = (coverId: number, size: "S" | "M" | "L" = "L") =>
	`${COVERS}/${coverId}-${size}.jpg`;
