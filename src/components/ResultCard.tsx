import type { BookSearchResult } from "../types/books";
import { getCoverUrl } from "../api/openLibrary";
import { Link } from "react-router-dom";

interface ResultCardProps {
	book: BookSearchResult;
}

function ResultCard({ book }: ResultCardProps) {
	const authors = book.author_name?.join(", ") ?? "Unknown author";
	const label = `View details for ${book.title} by ${authors}`;

	return (
		<Link
			to={`/books/${book.key.split("/").pop()}`}
			aria-label={label}
			className="flex h-full flex-col overflow-hidden rounded-md border border-border bg-surface-card text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
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
		</Link>
	);
}

export default ResultCard;
