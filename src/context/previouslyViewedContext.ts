import { createContext } from "react";
import type { PreviousBook } from "../types/books";

export interface PreviouslyViewedContextValue {
	books: PreviousBook[];
	addBook: (book: PreviousBook) => void;
}

export const PreviouslyViewedContext =
	createContext<PreviouslyViewedContextValue | null>(null);
