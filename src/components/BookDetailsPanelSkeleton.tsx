import Skeleton from "./ui/Skeleton";

function BookDetailsPanelSkeleton() {
	return (
		<div
			className="flex max-w-3xl flex-col gap-6"
			aria-busy="true"
			aria-label="Loading book details"
		>
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
	);
}

export default BookDetailsPanelSkeleton;
