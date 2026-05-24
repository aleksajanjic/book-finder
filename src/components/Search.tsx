import SearchBar from "./ui/SearchBar";
import type { SearchProps } from "../types/search";

function Search(props: SearchProps) {
	const { initialQuery, onSearch, onClear } = props;

	return (
		<section className="space-y-3" aria-labelledby="home-heading">
			<h1
				id="home-heading"
				className="m-0 text-2xl font-bold text-neutral-faint"
			>
				Find your next read
			</h1>
			<p className="text-text-secondary">
				Search millions of books from the Open Library
			</p>
			<SearchBar
				initialQuery={initialQuery}
				onSearch={onSearch}
				onClear={onClear}
			/>
		</section>
	);
}

export default Search;
