import { useState } from "react";
import PreviouslyViewed from "../components/PreviouslyViewed";
import Results from "../components/Results";
import Search from "../components/Search";
import { searchBooks } from "../api/openLibrary";
import Pagination from "../components/Pagination";
import Loader from "../components/ui/Loader";

const BOOKS_PER_PAGE = 100;

function Home() {
	const [query, setQuery] = useState("");
	const [books, setBooks] = useState([]);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

	const fetchBooks = async (searchQuery: string, pageNumber: number) => {
		try {
			setIsLoading(true);
			const data = await searchBooks(searchQuery, pageNumber);
			setBooks(data.docs);
			setTotalPages(Math.ceil(data.numFound / BOOKS_PER_PAGE));
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = async (value: string) => {
		if (!value.trim()) {
			return;
		}

		setQuery(value);
		setPage(1);
		await fetchBooks(value, 1);
	};

	const handlePageChange = async (newPage: number) => {
		setPage(newPage);
		await fetchBooks(query, newPage);
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const handleClear = () => {
		setQuery("");
		setBooks([]);
		setPage(1);
		setTotalPages(0);
	};

	return (
		<div className="flex flex-col">
			<Search
				query={query}
				setQuery={setQuery}
				onSearch={handleSearch}
				onClear={handleClear}
			/>

			{isLoading && <Loader />}

			{!isLoading && books.length > 0 && (
				<>
					<Results books={books} />

					<Pagination
						currentPage={page}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</>
			)}

			<PreviouslyViewed />
		</div>
	);
}

export default Home;
