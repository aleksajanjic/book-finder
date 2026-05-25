import { Link } from "react-router-dom";
import { getCoverUrl } from "../api/openLibrary";
import { prefetchBookDetails } from "../hooks/prefetchBookDetails";
import { usePreviouslyViewed } from "../hooks/usePreviouslyViewed";
import { workKeyToId } from "../lib/workKey";
import type { BookDetailsLocationState } from "../types/navigation";

function PreviouslyViewed() {
	const { books } = usePreviouslyViewed();

	return (
		<section className="mt-12" aria-labelledby="previously-viewed-heading">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h2
						id="previously-viewed-heading"
						className="text-2xl font-bold text-text-primary"
					>
						Previously Viewed
					</h2>

					<p className="mt-1 text-sm text-text-secondary">
						Books you recently opened
					</p>
				</div>
			</div>

			<div className="flex gap-3 overflow-x-auto py-2">
				{books.map((book) => {
					const id = workKeyToId(book.key);
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
							key={book.key}
							className="flex min-w-45 max-w-125 gap-2 rounded-lg border border-border bg-surface-card p-2 hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
							to={`/books/${id}`}
							state={locationState}
							aria-label={`View ${book.title}`}
							onMouseEnter={prefetch}
							onFocus={prefetch}
							onTouchStart={prefetch}
						>
							{book.cover_i && (
								<img
									src={getCoverUrl(book.cover_i)}
									alt=""
									className="h-14 w-10 rounded object-cover"
								/>
							)}
							<div className="flex flex-col justify-center">
								<p className="line-clamp-2 text-xs font-medium">
									{book.title}
								</p>
								<p className="line-clamp-1 text-[10px] text-text-secondary">
									{book.author_name?.join(", ")}
								</p>
							</div>
						</Link>
					);
				})}
			</div>

			{books.length === 0 && (
				<div className="rounded-2xl border border-border bg-surface-card p-6">
					<p className="text-text-secondary">
						No recently viewed books yet.
					</p>
				</div>
			)}
		</section>
	);
}

export default PreviouslyViewed;
