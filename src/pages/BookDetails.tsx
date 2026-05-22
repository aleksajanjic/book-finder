import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBook, getCoverUrl } from "../api/openLibrary";
import type { BookDetail } from "../types/books";
import { addPreviouslyViewed } from "../utils/previouslyViewed";

function BookDetails() {
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const [book, setBook] = useState<BookDetail | null>(null);
	const [authors, setAuthors] = useState<string[]>([]);
	const coverId = book?.covers?.[0] ?? (book as any)?.cover_i;
	const description =
		typeof book?.description === "string"
			? book?.description
			: book?.description?.value;

	const fetchAuthors = async (authorRefs: any[]) => {
		const results = await Promise.all(
			authorRefs.map(async (ref) => {
				const id = ref.author.key.split("/").pop();

				const res = await fetch(
					`https://openlibrary.org/authors/${id}.json`,
				);

				const data = await res.json();

				return data.name;
			}),
		);

		setAuthors(results);

		return results;
	};

	useEffect(() => {
		if (!id) {
			return;
		}

		const fetchBook = async () => {
			try {
				const data = await getBook(id);

				if (data.authors) {
					fetchAuthors(data.authors);
				}

				setBook(data);

				const authorNames = data.authors
					? await fetchAuthors(data.authors)
					: [];

				addPreviouslyViewed({
					key: data.key,
					title: data.title,
					cover_i: data.covers?.[0],
					author_name: authorNames,
				});
			} catch (error) {
				console.error(error);
			}
		};
		fetchBook();
	}, [id]);

	if (!book) return "Loading...";

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

						<div className="flex flex-wrap items-center gap-2 mt-3">
							{authors.length > 0 ? (
								<>
									<p className="text-text-secondary">
										Authors:
									</p>

									{authors.map((author) => (
										<div
											key={author}
											className="px-3 py-1 rounded-full border border-border bg-surface-card text-sm text-text-secondary"
										>
											{author}
										</div>
									))}
								</>
							) : (
								<div className="text-text-secondary">
									Unknown author
								</div>
							)}
						</div>
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
