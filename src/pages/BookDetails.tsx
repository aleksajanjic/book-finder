import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuthor, getBook, getCoverUrl } from "../api/openLibrary";
import { toastRequestError } from "../lib/requestToast";
import type {
	BookDetail,
	BookEdition,
	BookEditionsResponse,
	WorkAuthorRef,
} from "../types/books";
import { usePreviouslyViewed } from "../context/PreviouslyViewedContext";
import Loader from "../components/ui/Loader";

function BookDetails() {
	const navigate = useNavigate();
	const { addBook } = usePreviouslyViewed();
	const { id } = useParams<{ id: string }>();
	const [book, setBook] = useState<BookDetail | null>(null);
	const [authors, setAuthors] = useState<string[] | null>(null);
	const [edition, setEdition] = useState<BookEdition | null>(null);
	const [loading, setLoading] = useState(true);
	const coverId = book?.covers?.[0];
	const isbn = edition?.isbn_13?.[0] ?? edition?.isbn_10?.[0];
	const publisher = edition?.publishers?.[0];
	const description =
		typeof book?.description === "string"
			? book.description
			: book?.description?.value;

	const fetchAuthors = async (authorRefs: WorkAuthorRef[]) => {
		try {
			const results = await Promise.all(
				authorRefs.map(async (ref) => {
					const authorId = ref.author.key.split("/").pop();

					if (!authorId) {
						return "";
					}

					const data = await getAuthor(authorId);
					return data.name;
				}),
			);

			return results.filter(Boolean);
		} catch (error) {
			toastRequestError(error, "Could not load authors");
			return [];
		}
	};

	useEffect(() => {
		if (!id) {
			return;
		}

		const fetchBook = async () => {
			setLoading(true);

			try {
				const work = await getBook(id);

				const authorNames = work.authors
					? await fetchAuthors(work.authors)
					: [];

				const editionsRes = await fetch(
					`https://openlibrary.org${work.key}/editions.json`,
				);

				if (!editionsRes.ok) {
					throw new Error("Failed to fetch editions");
				}

				const editionsData =
					(await editionsRes.json()) as BookEditionsResponse;

				setBook(work);
				setAuthors(authorNames);
				setEdition(editionsData.entries?.[0] ?? null);

				addBook({
					key: work.key,
					title: work.title,
					cover_i: work.covers?.[0],
					author_name: authorNames,
				});
			} catch (error) {
				toastRequestError(error, "Could not load book details");
			} finally {
				setLoading(false);
			}
		};

		fetchBook();
	}, [id]);

	if (loading || !book || authors === null) {
		return <Loader />;
	}

	return (
		<>
			<div
				onClick={() => navigate("/")}
				className="w-fit cursor-pointer rounded-md border border-border bg-surface-card px-4 py-2 text-text-primary"
			>
				← Return to home page
			</div>

			<div className="mt-8 flex flex-col gap-8 lg:flex-row">
				<div className="shrink-0">
					{coverId ? (
						<img
							src={getCoverUrl(coverId)}
							alt={book.title}
							className="h-105 w-70 rounded-xl border border-border object-cover shadow-lg"
						/>
					) : (
						<div className="flex h-105 w-70 items-center justify-center rounded-xl border border-border bg-surface-card text-text-secondary">
							No cover available
						</div>
					)}
				</div>

				<div className="flex max-w-3xl flex-col gap-6">
					<div>
						<h1 className="text-3xl font-bold leading-tight">
							{book.title}
						</h1>

						{book.first_publish_date && (
							<p className="mt-2 text-text-secondary">
								First published: {book.first_publish_date}
							</p>
						)}

						<div className="mt-4 flex flex-wrap items-center gap-2">
							{authors.length > 0 ? (
								authors.map((author) => (
									<div
										key={author}
										className="rounded-full border border-border bg-surface-card px-3 py-1 text-sm text-text-secondary"
									>
										{author}
									</div>
								))
							) : (
								<div className="text-text-secondary">
									Unknown author
								</div>
							)}
						</div>
					</div>

					<div className="flex flex-wrap gap-3">
						{isbn && (
							<div className="rounded-full border border-border px-3 py-1 text-sm text-text-secondary">
								ISBN: {isbn}
							</div>
						)}

						{publisher && (
							<div className="rounded-full border border-border px-3 py-1 text-sm text-text-secondary">
								Publisher: {publisher}
							</div>
						)}
					</div>

					<div className="max-w-2xl leading-relaxed text-text-secondary">
						{description || "No description available"}
					</div>
				</div>
			</div>
		</>
	);
}

export default BookDetails;
