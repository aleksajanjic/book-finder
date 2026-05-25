import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PreviouslyViewed from "../components/PreviouslyViewed";
import Results from "../components/Results";
import ResultsSkeleton from "../components/ResultsSkeleton";
import Search from "../components/Search";
import HomeWelcome from "../components/HomeWelcome";
import TopProgress from "../components/ui/TopProgress";
import { BOOKS_PER_PAGE } from "../api/openLibrary";
import Pagination from "../components/Pagination";
import { prefetchBookSearch } from "../hooks/prefetchBookSearch";
import { useBookSearch } from "../hooks/useBookSearch";

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

	const { data, isLoading, isFetching, isError, error } = useBookSearch(
		q,
		page,
	);
	const hasSearch = Boolean(q);
	const books = hasSearch ? (data?.docs ?? []) : [];
	const totalCount = hasSearch ? (data?.numFound ?? 0) : 0;
	const totalPages = Math.ceil(totalCount / BOOKS_PER_PAGE);
	const showInitialSkeleton = hasSearch && isLoading;
	const showResults = hasSearch && !isError && books.length > 0;
	const showPageProgress = hasSearch && isFetching && !isLoading;

	useEffect(() => {
		if (!q || !data || page >= totalPages) {
			return;
		}

		prefetchBookSearch(q, page + 1);
	}, [q, page, totalPages, data]);

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
	};

	return (
		<div className="flex flex-col">
			<TopProgress active={hasSearch && isFetching} />

			<Search
				key={q}
				initialQuery={q}
				onSearch={handleSearch}
				onClear={handleClear}
			/>

			{!hasSearch && <HomeWelcome />}

			{showInitialSkeleton && <ResultsSkeleton />}

			{hasSearch && isError && (
				<p className="mt-4 text-red-600" role="alert">
					{error instanceof Error ? error.message : "Search failed"}
				</p>
			)}

			{showResults && (
				<div className="mt-4" aria-busy={showPageProgress}>
					<Results books={books} totalCount={totalCount} />

					{totalPages > 1 && (
						<div className="m-10 flex items-center justify-center">
							<Pagination
								currentPage={page}
								totalPages={totalPages}
								searchQuery={q}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</div>
			)}

			{hasSearch && !isLoading && !isError && books.length === 0 && (
				<div className="mt-4 flex items-center justify-center rounded-2xl border border-border bg-surface-card p-10">
					<div className="space-y-2 text-center">
						<p className="text-base font-medium text-text">
							No results found
						</p>
						<p className="text-sm text-text-secondary">
							Try a different search term
						</p>
					</div>
				</div>
			)}

			<PreviouslyViewed />
		</div>
	);
}

export default Home;
