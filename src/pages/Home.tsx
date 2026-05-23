import { useRef, useState } from "react";
import PreviouslyViewed from "../components/PreviouslyViewed";
import Results from "../components/Results";
import Search from "../components/Search";
import {
	BOOKS_PER_PAGE,
	searchBooksWithCovers,
} from "../api/openLibrary";
import Pagination from "../components/Pagination";
import Loader from "../components/ui/Loader";
import type { BookSearchResult } from "../types/books";

function Home() {
	const [query, setQuery] = useState("");
	const [books, setBooks] = useState<BookSearchResult[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const pageCacheRef = useRef<Map<number, BookSearchResult[]>>(new Map());

	const totalPages = Math.ceil(totalCount / BOOKS_PER_PAGE);

	const loadPage = async (searchQuery: string, pageNumber: number) => {
		const cached = pageCacheRef.current.get(pageNumber);
		if (cached) {
			setBooks(cached);
			return;
		}

		const data = await searchBooksWithCovers(searchQuery, pageNumber);
		pageCacheRef.current.set(pageNumber, data.docs);
		setBooks(data.docs);
		setTotalCount(data.numFound);
	};

	const fetchBooks = async (searchQuery: string, pageNumber: number) => {
		try {
			setIsLoading(true);
			await loadPage(searchQuery, pageNumber);
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

		pageCacheRef.current = new Map();
		setQuery(value);
		setPage(1);
		setBooks([]);
		setTotalCount(0);
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
		setTotalCount(0);
		setPage(1);
		pageCacheRef.current = new Map();
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
					<Results books={books} totalCount={totalCount} />

					{totalPages > 1 && (
						<div className="flex justify-center items-center m-10">
							<Pagination
								currentPage={page}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</>
			)}

			<PreviouslyViewed />
		</div>
	);
}

export default Home;
