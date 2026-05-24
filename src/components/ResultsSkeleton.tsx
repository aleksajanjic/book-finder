import Skeleton from "./ui/Skeleton";

const PLACEHOLDER_COUNT = 8;

function ResultsSkeleton() {
	return (
		<div
			className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4"
			aria-busy="true"
			aria-label="Loading search results"
		>
			{Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
				<div
					key={index}
					className="flex flex-col overflow-hidden rounded-md border border-border bg-surface-card"
				>
					<Skeleton className="h-75 w-full rounded-none" />
					<div className="space-y-2 p-2">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-3 w-1/2" />
					</div>
				</div>
			))}
		</div>
	);
}

export default ResultsSkeleton;
