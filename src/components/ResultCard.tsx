import type { Book } from "../types/books";
import { getCoverUrl } from "../api/openLibrary";
import { useNavigate } from "react-router-dom";

interface ResultCardProps {
	book: Book;
}

function ResultCard({ book }: ResultCardProps) {
	console.log("book", book);

	const navigate = useNavigate();
	const id = book.key.split("/").pop();

	return (
		<div
			onClick={() => navigate(`/books/${id}`)}
			className="h-full flex flex-col rounded-md border border-border bg-surface-card text-text-primary overflow-hidden"
		>
			<div className="w-full h-75 bg-surface-elevated">
				{book.cover_i && (
					<img
						src={getCoverUrl(book.cover_i)}
						alt={book.title}
						className="w-full h-full object-contain"
					/>
				)}
			</div>

			<div className="p-2">
				<h2 className="font-bold">{book.title}</h2>
				<p className="text-text-secondary">
					{book.author_name?.join(", ")}
				</p>
			</div>
		</div>
	);
}

export default ResultCard;
