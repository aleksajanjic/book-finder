import type { Book } from "../types/books";
import ResultCard from "./ResultCard";

interface ResultsProps {
	books: Book[];
}

function Results({ books }: ResultsProps) {
	return (
		<div>
			<h1>Results · {books.length} found</h1>

			{books.map((book) => (
				<ResultCard key={book.key} book={book} />
			))}
		</div>
	);
}

export default Results;
