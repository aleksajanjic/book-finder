import { prefetchBookSearch } from "../hooks/prefetchBookSearch";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	searchQuery: string;
	onPageChange: (value: number) => void;
}

type PaginationItem = number | "ellipsis";

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

	return (
		<nav
			className="flex items-center gap-2"
			aria-label="Search results pagination"
		>
			<button
				type="button"
				onClick={() => onPageChange(currentPage - 1)}
				onMouseEnter={() => prefetchPage(currentPage - 1)}
				onFocus={() => prefetchPage(currentPage - 1)}
				disabled={currentPage === 1}
				aria-label="Previous page"
				className="cursor-pointer rounded border px-3 py-1 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
			>
				Prev
			</button>

			{pages.map((page, index) =>
				page === "ellipsis" ? (
					<span
						key={`ellipsis-${index}`}
						className="select-none px-2 text-text-secondary"
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
						aria-current={currentPage === page ? "page" : undefined}
						className={`min-w-9 cursor-pointer rounded border px-3 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus ${
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
				onClick={() => onPageChange(currentPage + 1)}
				onMouseEnter={() => prefetchPage(currentPage + 1)}
				onFocus={() => prefetchPage(currentPage + 1)}
				disabled={currentPage === totalPages}
				aria-label="Next page"
				className="cursor-pointer rounded border px-3 py-1 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
			>
				Next
			</button>
		</nav>
	);
}

export default Pagination;
