import { useEffect, useState } from "react";
import { getPreviouslyViewed } from "../utils/previouslyViewed";
import { Link, useLocation } from "react-router-dom";
import type { PreviousBook } from "../types/books";

function Header() {
	const location = useLocation();

	const [previousBooks, setPreviousBooks] = useState<PreviousBook[]>([]);
	useEffect(() => {
		setPreviousBooks(getPreviouslyViewed());
	}, [location.pathname]);

	return (
		<div className="bg-surface-card text-text-primary font-extrabold text-2xl flex justify-between items-center p-2 rounded-md">
			<Link to="/" className="flex items-center gap-2 select-none">
				📚 BookFinder
			</Link>
			{previousBooks.length > 0 && (
				<div className="font-normal text-text-secondary text-sm border-2 border-border rounded-full py-0.75 px-3.75">
					Previously Viewed ({previousBooks.length})
				</div>
			)}
		</div>
	);
}

export default Header;
