interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (value: number) => void;
}

function Pagination(props: PaginationProps) {
	const { currentPage, totalPages, onPageChange } = props;

	if (totalPages <= 1) {
		return null;
	}

	const generatePages = () => {
		const pages: (number | string)[] = [];
		const showLeftDots = currentPage > 4;
		const showRightDots = currentPage < totalPages - 3;

		pages.push(1);

		if (showLeftDots) {
			pages.push("...");
		}

		const startPage = Math.max(2, currentPage - 1);
		const endPage = Math.min(totalPages - 1, currentPage + 1);

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		if (showRightDots) {
			pages.push("...");
		}

		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return [...new Set(pages)];
	};

	const pages = generatePages();

	return (
		<div className="flex items-center gap-2">
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="rounded border px-3 py-1 disabled:opacity-50 cursor-pointer"
			>
				Prev
			</button>

			{pages.map((page, index) =>
				page === "..." ? (
					<span key={`dots-${index}`} className="px-2">
						...
					</span>
				) : (
					<button
						key={page}
						onClick={() => onPageChange(page as number)}
						className={`rounded border px-3 py-1 cursor-pointer ${
							currentPage === page ? "bg-black text-white" : ""
						}`}
					>
						{page}
					</button>
				),
			)}

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="rounded border px-3 py-1 disabled:opacity-50 cursor-pointer"
			>
				Next
			</button>
		</div>
	);
}

export default Pagination;
