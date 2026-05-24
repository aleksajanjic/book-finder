import Skeleton from "./ui/Skeleton";

function BookDetailsSkeleton() {
	return (
		<div
			className="mt-8 flex flex-col gap-8 lg:flex-row"
			aria-busy="true"
			aria-label="Loading book details"
		>
			<Skeleton className="h-105 w-70 shrink-0 rounded-xl" />
			<div className="flex max-w-3xl flex-1 flex-col gap-6">
				<Skeleton className="h-9 w-3/4" />
				<Skeleton className="h-4 w-1/3" />
				<div className="flex flex-wrap gap-2">
					<Skeleton className="h-8 w-24 rounded-full" />
					<Skeleton className="h-8 w-28 rounded-full" />
				</div>
				<div className="flex flex-wrap gap-3">
					<Skeleton className="h-8 w-32 rounded-full" />
					<Skeleton className="h-8 w-40 rounded-full" />
				</div>
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-4 w-2/3" />
				</div>
			</div>
		</div>
	);
}

export default BookDetailsSkeleton;
