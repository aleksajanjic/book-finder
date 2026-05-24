import type { BookSearchResult } from "../types/books";
import ResultCard from "./ResultCard";

interface ResultsProps {
	books: BookSearchResult[];
	totalCount: number;
}

function Results({ books, totalCount }: ResultsProps) {
	return (
		<section aria-live="polite">
			{books.length > 0 && (
				<h2 className="text-xl font-semibold">
					Results · {totalCount} found
				</h2>
			)}
			<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
				{books.map((book) => (
					<ResultCard key={book.key} book={book} />
				))}
			</div>
		</section>
	);
}

export default Results;
