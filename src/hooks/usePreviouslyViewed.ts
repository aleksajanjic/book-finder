import { useContext } from "react";
import { PreviouslyViewedContext } from "../context/previouslyViewedContext";

export function usePreviouslyViewed() {
	const context = useContext(PreviouslyViewedContext);

	if (!context) {
		throw new Error(
			"usePreviouslyViewed must be used within PreviouslyViewedProvider",
		);
	}

	return context;
}
