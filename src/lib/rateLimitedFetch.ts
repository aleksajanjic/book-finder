const MIN_INTERVAL_MS = 1000;

let lastRequestAt = 0;
let chain: Promise<unknown> = Promise.resolve();

function waitForSlot(): Promise<void> {
	const run = async () => {
		const now = Date.now();
		const delay = Math.max(0, MIN_INTERVAL_MS - (now - lastRequestAt));
		if (delay > 0) {
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
		lastRequestAt = Date.now();
	};

	const scheduled = chain.then(run);
	chain = scheduled.catch(() => {});
	return scheduled;
}

export async function rateLimitedFetch(
	input: RequestInfo | URL,
	init?: RequestInit,
): Promise<Response> {
	return waitForSlot().then(() => fetch(input, init));
}
