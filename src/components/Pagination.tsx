interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (value: number) => void;
}

function Pagination(props: PaginationProps) {
	const { currentPage, totalPages, onPageChange } = props;

	if (totalPages <= 1) return null;

	const pages = [];

	for (let i = 1; i <= totalPages; i++) {
		pages.push(i);
	}

	return (
		<div className="flex items-center gap-2">
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="rounded border px-3 py-1 disabled:opacity-50"
			>
				Prev
			</button>

			{pages.map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					className={`rounded border px-3 py-1 ${
						currentPage === page ? "bg-black text-white" : ""
					}`}
				>
					{page}
				</button>
			))}

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="rounded border px-3 py-1 disabled:opacity-50"
			>
				Next
			</button>
		</div>
	);
}

export default Pagination;
