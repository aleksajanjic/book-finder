import type { Book } from "../types/books";

interface ResultCardProps {
	book: Book;
}

function ResultCard(props: ResultCardProps) {
	const { book } = props;



	return <div>{book.title}</div>;
}

export default ResultCard;
