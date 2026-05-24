import { useState } from "react";
import type { SearchProps } from "../../types/search";

const SEARCH_INPUT_ID = "book-search";

function SearchBar({ initialQuery, onSearch, onClear }: SearchProps) {
	const [query, setQuery] = useState(initialQuery);

	return (
		<div className="flex gap-2">
			<label htmlFor={SEARCH_INPUT_ID} className="sr-only">
				Search books by title
			</label>
			<input
				id={SEARCH_INPUT_ID}
				type="search"
				value={query}
				onChange={(e) => {
					const value = e.target.value;
					setQuery(value);

					if (!value.trim()) {
						onClear();
					}
				}}
				onKeyDown={(e) => {
					if (e.key !== "Enter") {
						return;
					}
					if (!query.trim()) {
						return;
					}

					onSearch(query);
				}}
				className="w-full rounded-md border border-border bg-surface-card p-2 text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
				placeholder="Search books..."
				autoComplete="off"
			/>

			<button
				type="button"
				onClick={() => {
					if (!query.trim()) {
						return;
					}
					onSearch(query);
				}}
				className="cursor-pointer rounded-md bg-accent px-4 py-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
			>
				Search
			</button>
			<button
				type="button"
				onClick={() => {
					setQuery("");
					onClear();
				}}
				className="cursor-pointer rounded-md border border-border px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
			>
				Clear
			</button>
		</div>
	);
}

export default SearchBar;
