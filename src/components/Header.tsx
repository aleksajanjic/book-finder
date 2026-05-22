import { getPreviouslyViewed } from "../utils/previouslyViewed";

function Header() {
	const previousBooks = getPreviouslyViewed();

	return (
		<div className="bg-surface-card text-text-primary font-extrabold text-2xl flex justify-between items-center p-2 rounded-md">
			📚 BookFinder
			{previousBooks.length > 0 && (
				<div className="font-normal text-text-secondary text-sm border-2 border-border rounded-full py-0.75 px-3.75">
					Previously Viewed ({previousBooks.length})
				</div>
			)}
		</div>
	);
}

export default Header;
