function PreviouslyViewed() {
	return (
		<section className="mt-12">
			<div className="flex items-center justify-between mb-4">
				<div>
					<h2 className="text-2xl font-bold text-text-primary">
						Previously Viewed
					</h2>

					<p className="text-sm text-text-secondary mt-1">
						Books you recently opened
					</p>
				</div>
			</div>

			<div className="rounded-2xl border border-border bg-surface-card p-6">
				<p className="text-text-secondary">
					No recently viewed books yet.
				</p>
			</div>
		</section>
	);
}

export default PreviouslyViewed;
