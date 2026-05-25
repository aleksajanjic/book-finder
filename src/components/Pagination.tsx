import { prefetchBookSearch } from "../hooks/prefetchBookSearch";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	searchQuery: string;
	onPageChange: (value: number) => void;
}

type PaginationItem = number | "ellipsis";

const buttonClass =
	"cursor-pointer rounded border px-2 py-1 text-sm disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus sm:px-3";

function getPaginationItems(
	currentPage: number,
	totalPages: number,
): PaginationItem[] {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, index) => index + 1);
	}

	const items: PaginationItem[] = [1];

	let start = Math.max(2, currentPage - 1);
	let end = Math.min(totalPages - 1, currentPage + 1);

	if (currentPage <= 3) {
		start = 2;
		end = 4;
	} else if (currentPage >= totalPages - 2) {
		start = totalPages - 3;
		end = totalPages - 1;
	}

	if (start > 2) {
		items.push("ellipsis");
	}

	for (let page = start; page <= end; page += 1) {
		items.push(page);
	}

	if (end < totalPages - 1) {
		items.push("ellipsis");
	}

	items.push(totalPages);

	return items;
}

function Pagination(props: PaginationProps) {
	const { currentPage, totalPages, searchQuery, onPageChange } = props;

	if (totalPages <= 1) {
		return null;
	}

	const pages = getPaginationItems(currentPage, totalPages);
	const prefetchPage = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			prefetchBookSearch(searchQuery, page);
		}
	};

	const goPrev = () => onPageChange(currentPage - 1);
	const goNext = () => onPageChange(currentPage + 1);

	return (
		<div className="w-full max-w-full">
			<nav
				className="flex w-full items-center justify-between gap-2 sm:hidden"
				aria-label="Search results pagination"
			>
				<button
					type="button"
					onClick={goPrev}
					onFocus={() => prefetchPage(currentPage - 1)}
					disabled={currentPage === 1}
					aria-label="Previous page"
					className={buttonClass}
				>
					Prev
				</button>

				<p
					className="shrink-0 text-sm text-text-secondary"
					aria-current="page"
				>
					Page {currentPage} of {totalPages}
				</p>

				<button
					type="button"
					onClick={goNext}
					onFocus={() => prefetchPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					aria-label="Next page"
					className={buttonClass}
				>
					Next
				</button>
			</nav>

			{/* Desktop: full page numbers */}
			<nav
				className="hidden flex-wrap items-center justify-center gap-1 sm:flex sm:gap-2"
				aria-label="Search results pagination"
			>
				<button
					type="button"
					onClick={goPrev}
					onMouseEnter={() => prefetchPage(currentPage - 1)}
					onFocus={() => prefetchPage(currentPage - 1)}
					disabled={currentPage === 1}
					aria-label="Previous page"
					className={buttonClass}
				>
					Prev
				</button>

				{pages.map((page, index) =>
					page === "ellipsis" ? (
						<span
							key={`ellipsis-${index}`}
							className="select-none px-1 text-sm text-text-secondary sm:px-2"
							aria-hidden
						>
							…
						</span>
					) : (
						<button
							type="button"
							key={page}
							onClick={() => onPageChange(page)}
							onMouseEnter={() => prefetchPage(page)}
							onFocus={() => prefetchPage(page)}
							aria-label={`Page ${page}`}
							aria-current={
								currentPage === page ? "page" : undefined
							}
							className={`min-w-8 cursor-pointer rounded border px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus sm:min-w-9 sm:px-3 ${
								currentPage === page
									? "border-black bg-black text-white"
									: ""
							}`}
						>
							{page}
						</button>
					),
				)}

				<button
					type="button"
					onClick={goNext}
					onMouseEnter={() => prefetchPage(currentPage + 1)}
					onFocus={() => prefetchPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					aria-label="Next page"
					className={buttonClass}
				>
					Next
				</button>
			</nav>
		</div>
	);
}

export default Pagination;
