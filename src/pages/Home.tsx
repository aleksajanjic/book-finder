import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PreviouslyViewed from "../components/PreviouslyViewed";
import Results from "../components/Results";
import Search from "../components/Search";
import { BOOKS_PER_PAGE, searchBooksWithCovers } from "../api/openLibrary";
import Pagination from "../components/Pagination";
import Loader from "../components/ui/Loader";
import type { BookSearchResult } from "../types/books";

function setSearchParamsForQuery(
	setSearchParams: ReturnType<typeof useSearchParams>[1],
	query: string,
	page: number,
) {
	const params = new URLSearchParams();
	if (query) {
		params.set("q", query);
	}
	if (page > 1) {
		params.set("page", String(page));
	}
	setSearchParams(params);
}

function Home() {
	const [searchParams, setSearchParams] = useSearchParams();
	const q = searchParams.get("q")?.trim() ?? "";
	const page = Math.max(
		1,
		Number.parseInt(searchParams.get("page") ?? "1", 10) || 1,
	);

	const [query, setQuery] = useState(q);
	const [books, setBooks] = useState<BookSearchResult[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const pageCacheRef = useRef<Map<number, BookSearchResult[]>>(new Map());
	const lastFetchedQRef = useRef("");

	const totalPages = Math.ceil(totalCount / BOOKS_PER_PAGE);

	useEffect(() => {
		setQuery(q);
	}, [q]);

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

	useEffect(() => {
		if (!q) {
			setBooks([]);
			setTotalCount(0);
			pageCacheRef.current = new Map();
			lastFetchedQRef.current = "";
			return;
		}

		if (q !== lastFetchedQRef.current) {
			pageCacheRef.current = new Map();
			lastFetchedQRef.current = q;
		}

		void fetchBooks(q, page);
	}, [q, page]);

	const handleSearch = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed) {
			return;
		}

		setSearchParamsForQuery(setSearchParams, trimmed, 1);
	};

	const handlePageChange = (newPage: number) => {
		setSearchParamsForQuery(setSearchParams, q, newPage);
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const handleClear = () => {
		setSearchParams({});
		setQuery("");
		setBooks([]);
		setTotalCount(0);
		pageCacheRef.current = new Map();
		lastFetchedQRef.current = "";
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
