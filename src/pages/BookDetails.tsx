import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCoverUrl } from "../api/openLibrary";
import BookDetailsPanelSkeleton from "../components/BookDetailsPanelSkeleton";
import BookDetailsSkeleton from "../components/BookDetailsSkeleton";
import TopProgress from "../components/ui/TopProgress";
import { usePreviouslyViewed } from "../hooks/usePreviouslyViewed";
import { useBookDetails } from "../hooks/useBookDetails";
import type { BookDetailsLocationState } from "../types/navigation";

function BackToHome({ onClick }: { onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="w-fit cursor-pointer rounded-md border border-border bg-surface-card px-4 py-2 text-text-primary"
		>
			← Return to home page
		</button>
	);
}

function BookDetailsMessage({
	title,
	message,
	onBack,
}: {
	title: string;
	message: string;
	onBack: () => void;
}) {
	return (
		<div className="space-y-6">
			<BackToHome onClick={onBack} />
			<div
				className="rounded-2xl border border-border bg-surface-card p-10 text-center"
				role="alert"
			>
				<p className="text-base font-medium text-text-primary">
					{title}
				</p>
				<p className="mt-2 text-sm text-text-secondary">{message}</p>
			</div>
		</div>
	);
}

function AuthorChips({ authors }: { authors: string[] }) {
	return (
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
				<div className="text-text-secondary">Unknown author</div>
			)}
		</div>
	);
}

function BookDetails() {
	const navigate = useNavigate();
	const location = useLocation();
	const { addBook } = usePreviouslyViewed();
	const { id } = useParams<{ id: string }>();
	const { data, isLoading, isFetching, isError, error } = useBookDetails(id);

	const preview = (location.state as BookDetailsLocationState | null)
		?.preview;
	const goHome = () => navigate(-1);

	useEffect(() => {
		if (!data) {
			return;
		}

		const coverId = data.work.covers?.[0];
		if (!coverId) {
			return;
		}

		addBook({
			key: data.work.key,
			title: data.work.title,
			cover_i: coverId,
			author_name: data.authorNames,
		});
	}, [data, addBook]);

	if (!id) {
		return (
			<BookDetailsMessage
				title="Invalid book link"
				message="This page does not include a book id."
				onBack={goHome}
			/>
		);
	}

	if (isLoading && !data) {
		if (preview) {
			const coverId = preview.cover_i;

			return (
				<article>
					<TopProgress active={isFetching} />
					<BackToHome onClick={goHome} />
					<div className="mt-8 flex flex-col gap-8 lg:flex-row">
						<div className="shrink-0">
							{coverId ? (
								<img
									src={getCoverUrl(coverId)}
									alt={preview.title}
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
									{preview.title}
								</h1>
								<AuthorChips
									authors={preview.author_name ?? []}
								/>
							</div>
							<BookDetailsPanelSkeleton />
						</div>
					</div>
				</article>
			);
		}

		return (
			<>
				<TopProgress active />
				<BackToHome onClick={goHome} />
				<BookDetailsSkeleton />
			</>
		);
	}

	if (isError) {
		return (
			<BookDetailsMessage
				title="Could not load book"
				message={
					error instanceof Error
						? error.message
						: "Something went wrong. Please try again."
				}
				onBack={goHome}
			/>
		);
	}

	if (!data) {
		return (
			<BookDetailsMessage
				title="Book not found"
				message="We could not find details for this book."
				onBack={goHome}
			/>
		);
	}

	const { work, authorNames, edition } = data;
	const coverId = work.covers?.[0] ?? preview?.cover_i;
	const isbn = edition?.isbn_13?.[0] ?? edition?.isbn_10?.[0];
	const publisher = edition?.publishers?.[0];
	const description =
		typeof work.description === "string"
			? work.description
			: work.description?.value;

	return (
		<article>
			<BackToHome onClick={goHome} />

			<div className="mt-8 flex flex-col gap-8 lg:flex-row">
				<div className="shrink-0">
					{coverId ? (
						<img
							src={getCoverUrl(coverId)}
							alt={work.title}
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
							{work.title}
						</h1>

						{work.first_publish_date && (
							<p className="mt-2 text-text-secondary">
								First published: {work.first_publish_date}
							</p>
						)}

						<AuthorChips authors={authorNames} />
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
		</article>
	);
}

export default BookDetails;
