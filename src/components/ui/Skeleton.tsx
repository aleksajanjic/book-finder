interface SkeletonProps {
	className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
	return (
		<div
			className={`animate-pulse rounded-md bg-surface-elevated ${className}`}
			aria-hidden
		/>
	);
}

export default Skeleton;
