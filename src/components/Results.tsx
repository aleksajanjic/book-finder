import type { Book } from "../types/books";
import ResultCard from "./ResultCard";

interface ResultsProps {
	books: Book[];
}

function Results({ books }: ResultsProps) {
	return (
		<div>
			{books.length > 0 && <h1>Results · {books.length} found</h1>}
			<div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
				{books.map((book) => (
					<ResultCard key={book.key} book={book} />
				))}
			</div>
		</div>
	);
}

export default Results;
