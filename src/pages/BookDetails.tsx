import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBook, getCoverUrl } from "../api/openLibrary";
import type { BookDetail } from "../types/books";

function BookDetails() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [book, setBook] = useState<BookDetail | null>(null);
	const coverId = book?.covers?.[0] ?? (book as any)?.cover_i;
	const description =
		typeof book?.description === "string"
			? book?.description
			: book?.description?.value;

	useEffect(() => {
		if (!id) {
			return;
		}

		const fetchBook = async () => {
			try {
				const data = await getBook(id);
				setBook(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchBook();
	}, [id]);

	if (!book) return "Loading...";

	console.log("book", book);

	return (
		<>
			<div
				onClick={() => navigate("/")}
				className="h-full flex flex-col rounded-md border border-border bg-surface-card text-text-primary overflow-hidden cursor-pointer w-fit px-4"
			>
				← return to home page
			</div>

			<div className="flex flex-col lg:flex-row gap-8 mt-8">
				<div className="shrink-0">
					{coverId && (
						<img
							src={getCoverUrl(coverId)}
							alt={book.title}
							className="w-70 h-105 object-cover rounded-xl shadow-lg border border-border"
						/>
					)}
				</div>

				<div className="flex flex-col gap-6">
					<div>
						<h1 className="text-3xl font-bold leading-tight">
							{book.title}
						</h1>

						<div className="leading-relaxed text-text-secondary max-w-2xl">
							{book?.first_publish_date && (
								<p>First published: {book.first_publish_date}</p>
							)}
						</div>

						<p className="text-text-secondary mt-2">
							{book.author_name?.join(", ")}
						</p>
					</div>

					<div className="flex flex-wrap gap-3">
						<div className="px-3 py-1 rounded-full border border-border text-sm text-text-secondary">
							Edition: {book.edition_count}
						</div>

						<div className="px-3 py-1 rounded-full border border-border text-sm text-text-secondary">
							Access: {book.ebook_access}
						</div>
					</div>

					<div className="leading-relaxed text-text-secondary max-w-2xl">
						{description || "No description available"}
					</div>
				</div>
			</div>
		</>
	);
}

export default BookDetails;
