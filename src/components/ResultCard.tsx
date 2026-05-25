import type { BookSearchResult } from "../types/books";
import type { BookDetailsLocationState } from "../types/navigation";
import { getCoverUrl } from "../api/openLibrary";
import { prefetchBookDetails } from "../hooks/prefetchBookDetails";
import { workKeyToId } from "../lib/workKey";
import { Link } from "react-router-dom";

interface ResultCardProps {
	book: BookSearchResult;
}

function ResultCard({ book }: ResultCardProps) {
	const id = workKeyToId(book.key);
	const authors = book.author_name?.join(", ") ?? "Unknown author";
	const label = `View details for ${book.title} by ${authors}`;

	const prefetch = () => prefetchBookDetails(id);

	const locationState: BookDetailsLocationState = {
		preview: {
			title: book.title,
			cover_i: book.cover_i,
			author_name: book.author_name,
		},
	};

	return (
		<Link
			to={`/books/${id}`}
			state={locationState}
			aria-label={label}
			onMouseEnter={prefetch}
			onFocus={prefetch}
			onTouchStart={prefetch}
			className="flex h-full flex-col overflow-hidden rounded-md border border-border bg-surface-card text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
		>
			<div className="h-75 w-full bg-surface-elevated">
				{book.cover_i && (
					<img
						src={getCoverUrl(book.cover_i)}
						alt=""
						className="h-full w-full object-contain"
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
