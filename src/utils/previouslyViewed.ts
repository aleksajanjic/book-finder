import type { PreviousBook } from "../types/books";

const KEY = "previously_viewed_books";

export const getPreviouslyViewed = (): PreviousBook[] => {
	const data = localStorage.getItem(KEY);

	if (!data) {
		return [];
	}

	return JSON.parse(data);
};

export const addPreviouslyViewed = (book: PreviousBook) => {
	const existing = getPreviouslyViewed();
	const filtered = existing.filter((b) => b.key !== book.key);
	const updated = [book, ...filtered].slice(0, 10);
	localStorage.setItem(KEY, JSON.stringify(updated));
};
