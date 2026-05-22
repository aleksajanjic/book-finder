import { useState } from "react";
import PreviouslyViewed from "../components/PreviouslyViewed";
import Results from "../components/Results";
import Search from "../components/Search";
import { searchBooks } from "../api/openLibrary";
import Pagination from "../components/Pagination";

function Home() {
	const [query, setQuery] = useState("");
	const [books, setBooks] = useState([]);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	const handleSearch = async (value: string) => {
		if (!value.trim()) {
			return;
		}

		try {
			setIsLoading(true);
			const data = await searchBooks(value, 1);
			setQuery(value);
			setBooks(data.docs);
			setPage(1);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClear = () => {
		setQuery("");
		setBooks([]);
	};

	// const handleNextPage = async () => {};

	// const handlePreviousPage = async () => {};

	return (
		<div className="flex flex-col">
			<Search
				query={query}
				setQuery={setQuery}
				onSearch={handleSearch}
				onClear={handleClear}
			/>

			{isLoading ? (
				<p>Loading...</p>
			) : (
				<>
					<Results books={books} />
					<Pagination />
				</>
			)}
			<PreviouslyViewed />
		</div>
	);
}

export default Home;
