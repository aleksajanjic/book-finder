import {
	useCallback,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import type { PreviousBook } from "../types/books";
import {
	getPreviouslyViewed,
	mergePreviouslyViewed,
	savePreviouslyViewed,
} from "../utils/previouslyViewed";
import { PreviouslyViewedContext } from "./previouslyViewedContext";

export function PreviouslyViewedProvider({ children }: { children: ReactNode }) {
	const [books, setBooks] = useState<PreviousBook[]>(() =>
		getPreviouslyViewed(),
	);

	const addBook = useCallback((book: PreviousBook) => {
		setBooks((existing) => {
			const updated = mergePreviouslyViewed(existing, book);
			savePreviouslyViewed(updated);
			return updated;
		});
	}, []);

	const value = useMemo(() => ({ books, addBook }), [books, addBook]);

	return (
		<PreviouslyViewedContext.Provider value={value}>
			{children}
		</PreviouslyViewedContext.Provider>
	);
}
