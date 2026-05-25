interface TopProgressProps {
	active: boolean;
}

function TopProgress({ active }: TopProgressProps) {
	if (!active) {
		return null;
	}

	return (
		<div
			className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden"
			role="progressbar"
			aria-busy="true"
			aria-label="Loading"
		>
			<div className="top-progress-bar h-full w-1/3 bg-accent" />
		</div>
	);
}

export default TopProgress;
